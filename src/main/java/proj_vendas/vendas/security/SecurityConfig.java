package proj_vendas.vendas.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
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
			.antMatchers("/css/**", "/jquery/**", "/img/**", "/js/**", "/fonts/**", "/erro/**", "/gazaltech/**", "/imprimir/**").permitAll()
			
			//acesso adm
			.antMatchers("/adm/**").hasAuthority("ADM")
			
			//acesso usuario
			.antMatchers("/u/**").hasAnyAuthority("USUARIO","ADM")
			
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
	            .invalidateHttpSession(true)
	            .deleteCookies("JSESSIONID")
				
			//tratamento de erro
			.and()
				.exceptionHandling()
				.accessDeniedPage("/permissao")
			.and()
				.sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
			.and()
				.httpBasic()
				
				//desabilitar verificacao
			.and()
				.csrf().disable();
	}
	/*
	.and()
		.sessionManagement()
		.sessionFixation().migrateSession() //migrar sessao para novo pc que acessar
	
	*/
	
	@Autowired
    public void configureInMemoryAuthentication(AuthenticationManagerBuilder auth) throws Exception
    {
        auth.inMemoryAuthentication()
                .withUser("teste@hotmail.com")
                .password(passwordEncoder().encode("root"))
                .roles("USUARIO", "ADM").authorities("ADM");
    }
	
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
