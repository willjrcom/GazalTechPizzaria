package proj_vendas.vendas;

import java.sql.DriverManager;

import org.directwebremoting.spring.DwrSpringServlet;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ImportResource;

@ImportResource(locations = "classpath:dwr-spring.xml")
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
			String url = "jdbc:sqlserver://ibitidaspizzasdb.database.windows.net:1433;database=IbitiDasPizzas;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;";
			DriverManager.getConnection(url, "willjrcom", "objetivo42461255!");
		}catch(Exception e) {
			System.err.println("Falha ao conectar ao banco de dados");
			System.out.println(e.getMessage());
		}
	}
	
	@Bean
	public ServletRegistrationBean<DwrSpringServlet> dwrSpringServlet(){
		DwrSpringServlet dwrServlet = new DwrSpringServlet();
		
		ServletRegistrationBean<DwrSpringServlet> registrationBean = new ServletRegistrationBean<>(dwrServlet, "/dwr/*");
	
		registrationBean.addInitParameter("debug","true");
		registrationBean.addInitParameter("activeReverseAjaxEnabled", "true");
		return registrationBean;
	}
}
