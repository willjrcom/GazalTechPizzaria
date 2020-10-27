package proj_vendas.vendas.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import proj_vendas.vendas.service.UsuarioService;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{

	@Autowired 
	private UsuarioService service;
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
		
			//liberar acesso basico de scripts
			.antMatchers("/css/**", "/jquery/**", "/img/**", "/js/**", "/fonts/**", "/dev/**", "/gazaltech/**").permitAll()
			
			//acesso adm
			.antMatchers("/a/**").hasAuthority("ADM")
			
			//acesso usuario
			.antMatchers("/u/**").hasAuthority("USUARIO")
			
			//autenticar
			.anyRequest().authenticated()
			
			//login
			.and()
				.formLogin()
				.loginPage("/index")
				.defaultSuccessUrl("/menu", true)
				.failureUrl("/index")
				.permitAll()
				
			//logout
			.and()
				.logout()
				.logoutSuccessUrl("/index")
				
			//tratamento de erro
			.and()
				.exceptionHandling()
				.accessDeniedPage("/acessoNegado")
				
			//desabilitar verificacao
			.and()
				.csrf().disable();
	}
    
	//criptografar senha
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(service).passwordEncoder(new BCryptPasswordEncoder());
	}
}
