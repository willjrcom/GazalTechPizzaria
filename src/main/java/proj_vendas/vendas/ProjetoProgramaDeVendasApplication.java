package proj_vendas.vendas;

import java.sql.DriverManager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

//@ImportResource(locations = "classpath:dwr-spring.xml")
@SpringBootApplication
public class ProjetoProgramaDeVendasApplication extends SpringBootServletInitializer{

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {//iniciar pelo aws
		return builder.sources(ProjetoProgramaDeVendasApplication.class);
	}
	
	public static void main(String[] args) {

		SpringApplication.run(ProjetoProgramaDeVendasApplication.class, args);
		
		//conectar ao banco de dados
		try {
			String url = "jdbc:mysql://localhost/vendas?useSSL=false&useLegacyDatetimeCode=false&serverTimezone=America/Sao_Paulo&SameSite=None";
			DriverManager.getConnection(url, "root", "toor");
		}catch(Exception e) {
			System.err.println("Falha ao conectar ao banco de dados");
			System.out.println(e.getMessage());
		}
	}
	/*
	@Bean
	public ServletRegistrationBean<DwrSpringServlet> dwrSpringServlet(){
		DwrSpringServlet dwrServlet = new DwrSpringServlet();
		
		ServletRegistrationBean<DwrSpringServlet> registrationBean =
				new ServletRegistrationBean<>(dwrServlet, "/dwr/*");
	
		registrationBean.addInitParameter("debug","true");
		registrationBean.addInitParameter("activeReverseAjaxEnabled", "true");
		return registrationBean;
	}*/
}
