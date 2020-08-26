package proj_vendas.vendas.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
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
			.antMatchers("/", "/fechamento/**", "/index/**", "/menu/**", "/mercadoPago/**").permitAll()
			.antMatchers("/cadastroCliente/**", "/cadastroFuncionario/**", "/cadastroProduto/**", "/cadastros/**").permitAll()
			.antMatchers("/clientesCadastrados/**", "/funcionariosCadastrados/**", "/produtosCadastrados/**").permitAll()
			.antMatchers("/cozinha/**", "/finalizar/**", "/motoboy/**", "/novoPedido/**").permitAll()
			.antMatchers("/pronto/**", "/receber/**", "/verpedido/**").permitAll()
			.antMatchers("/css/**", "/jquery/**", "/img/**", "/js/**", "/fonts/**").permitAll()
			.anyRequest().authenticated()
			
			.and()
				.formLogin()
				.loginPage("/index")
				.defaultSuccessUrl("/menu", true)
				.permitAll()
			.and()
				.logout()
				.logoutSuccessUrl("/index")
			.and().csrf().disable();
	}

	 /* To allow Pre-flight [OPTIONS] request from browser */
    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers(HttpMethod.OPTIONS, "/**");
    }
    
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(service).passwordEncoder(new BCryptPasswordEncoder());
	}
	
	
}
