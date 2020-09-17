package proj_vendas.vendas.security;

/*
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{

	@Autowired 
	private UsuarioService service;
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests()
			.antMatchers("/css/**", "/jquery/**", "/img/**", "/js/**", "/fonts/**", "/dev/**", "/gazaltech/**", "/new-user").permitAll()
			.anyRequest().authenticated()
			
			.and()
				.formLogin()
				.loginPage("/index")
				.defaultSuccessUrl("/menu", true)
				.failureUrl("/index")
				.permitAll()
			.and()
				.logout()
				.logoutSuccessUrl("/index")
			.and()
				.exceptionHandling()
				.accessDeniedPage("/acessoNegado")
			.and()
				.csrf().disable();
	}
    
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(service).passwordEncoder(new BCryptPasswordEncoder());
	}
}
*/