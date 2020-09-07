package proj_vendas.vendas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Usuarios;

@Service
public class UsuarioService implements UserDetailsService{
	
	@Autowired
	private Usuarios usuarios;
	
	@Transactional
	public Usuario buscarPorEmail(String email) {
		
		return usuarios.findByEmail(email);
	}

	@Override @Transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Usuario usuario = buscarPorEmail(username);
		return new User(
				usuario.getEmail(),
				usuario.getSenha(),
				AuthorityUtils.NO_AUTHORITIES
				);
	}
	
	public void salvarUsuarioDev() {
		Usuario usuario = new Usuario();
		usuario.setAtivo(true);
		usuario.setEmail("williamjunior67@gmail.com");
		usuario.setSenha(new BCryptPasswordEncoder().encode("objetivo42461255"));
		usuarios.save(usuario);
	}

	public Usuarios getUsuarios() {
		return usuarios;
	}

	public void setUsuarios(Usuarios usuarios) {
		this.usuarios = usuarios;
	}
	
	
}
