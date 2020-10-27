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
		
		LocalDate diaAtual = LocalDate.now(); // Create a date object
		String dia = diaAtual.toString();
	    
		//alterar a tabela dados
		Dado dado = new Dado();
		dado.setData(dia);
		
		//alterar a tabela dia
		Dia data = dias.buscarId1();
		
		if(data == null) {
			data = new Dia();
		}
		data.setDia(dia);
		
		//salvar dados
		dias.save(data);
		dados.save(dado);
		
		return new User(
			usuario.getEmail(),
			usuario.getSenha(),
			AuthorityUtils.createAuthorityList(usuario.getPerfil())
			);
	}
	
	public Usuarios getUsuarios() {
		return usuarios;
	}

	public void setUsuarios(Usuarios usuarios) {
		this.usuarios = usuarios;
	}
	
	
}
