package proj_vendas.vendas.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import proj_vendas.vendas.service.UsuarioService;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{

	@Autowired 
	private UsuarioService service;
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
		
			//liberar acesso basico de scripts
			.antMatchers("/css/**", "/jquery/**", "/img/**", "/js/**", "/fonts/**", "/erro/**", "/gazaltech/**", "/imprimir/**", "/email/**").permitAll()
			.antMatchers(HttpMethod.OPTIONS).permitAll()
			  
			//acesso dev
			.antMatchers("/dev/**").hasAnyAuthority("DEV")
			
			//acesso adm
			.antMatchers("/adm/**").hasAnyAuthority("ADM", "DEV")
			
			//acesso usuario
			.antMatchers("/u/**").hasAnyAuthority("USUARIO","ADM", "DEV")
			
			//autenticar
			.anyRequest().authenticated()
			
			//login
			.and()
				.formLogin()
				.loginPage("/index")
				.defaultSuccessUrl("/menu", true)
				.failureUrl("/index/erro")
				.permitAll()
				
			//logout
			.and()
				.logout()
				.logoutSuccessUrl("/index")
	            .invalidateHttpSession(true)
	            .deleteCookies("JSESSIONID")
				
			//tratamento de erro
			.and()
				.exceptionHandling()
				.accessDeniedPage("/permissao")
			.and()
				.sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
				
				//desabilitar verificacao
			.and()
				.csrf().disable();
	}
	/*
	.and()
		.sessionManagement()
		.sessionFixation().migrateSession() //migrar sessao para novo pc que acessar
	
	*/
	
	@Bean
	public PasswordEncoder passwordEncoder() {
	    return new BCryptPasswordEncoder();
	}
	
	//criptografar senha
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(service).passwordEncoder(new BCryptPasswordEncoder());
	}
}
