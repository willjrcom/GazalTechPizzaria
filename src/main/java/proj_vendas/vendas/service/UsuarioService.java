package proj_vendas.vendas.service;

import java.time.LocalDate;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Usuarios;

@Service
public class UsuarioService implements UserDetailsService{
	
	@Autowired
	private Usuarios usuarios;

	@Autowired
	private Dados dados;
	
	@Autowired
	private Dias dias;
	
	@Transactional
	public Usuario buscarPorEmail(String email) {
		
		return usuarios.findByEmail(email);
	}
	
	@Override @Transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Usuario usuario = buscarPorEmail(username);
		
		if(usuario.isAtivo() == false) {
			throw new UsernameNotFoundException("Usuário bloqueado.");
		}
		LocalDate diaAtual = LocalDate.now(); // Create a date object
		String dia = diaAtual.toString();
	    
		//alterar a tabela dados
		Dado dado = dados.findByData(dia);//busca no banco de dados
		
		if(dado == null) {//verifica se ja existe
			dado = new Dado();
		}
		dado.setData(dia);//seta a data atual
		
		//alterar a tabela dia
		Dia data = dias.buscarId1();
		
		if(data == null) {//verifica se dia existe
			data = new Dia();
		}
		data.setDia(dia);//seta dia
		
		//salvar dados
		dias.save(data);//salva o dia
		dados.save(dado);//salva a data
		
		return new User(
			usuario.getEmail(),
			usuario.getSenha(),
			AuthorityUtils.createAuthorityList(usuario.getPerfil())
			);
	}
}
