package proj_vendas.vendas.security;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import proj_vendas.vendas.service.UsuarioService;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{

	@Autowired 
	private UsuarioService service;
	
	@Autowired
	private DataSource datasource;
	
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
				
			//tratamento de erro
			.and()
				.exceptionHandling()
				.accessDeniedPage("/permissao")
			
			.and()
				.httpBasic()
			
				//desabilitar verificacao
			.and()
				.csrf().disable();
	}
	
	//usuario padrao
	@Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) 
      throws Exception {
        auth.jdbcAuthentication().dataSource(datasource)
        .withDefaultSchema().withUser("williamjunior@gmail.com")
          .password(passwordEncoder().encode("root")).authorities("ADM").roles("ADM");
    }
	
	@Bean
	public PasswordEncoder passwordEncoder() {
	    return new BCryptPasswordEncoder();
	}
	
	@Bean
	public UserDetailsService users() {
	    UserDetails admin = User.builder()
	        .username("williamjunior67@gmail.com")
	        .password("{bcrypt}$2a$10$0bM08/LDOpUBPGSKg.wVL.MEQkshAefRfgSu467mnGMV3trwQCfea")
	        .roles("USUARIO", "ADM")
	        .build();
	    return new InMemoryUserDetailsManager(admin);
	}
	
	//criptografar senha
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(service).passwordEncoder(new BCryptPasswordEncoder());
	}
}
