package proj_vendas.vendas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

//@ImportResource(locations = "classpath:dwr-spring.xml")
@SpringBootApplication
@EnableAsync
public class ProjetoProgramaDeVendasApplication extends SpringBootServletInitializer{

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder app) {//iniciar servidor
		return app.sources(ProjetoProgramaDeVendasApplication.class);
	}
	
	public static void main(String[] args) throws InterruptedException {
		System.out.println(new BCryptPasswordEncoder().encode("root"));
		SpringApplication.run(ProjetoProgramaDeVendasApplication.class, args);
		//Thread.interrupted();
		//Thread.sleep(60000);
		//new Thread(threadLimpeza).start();
	}
	/*
	@Bean(name = "fileExecutor")
    public Executor asyncExecutor() {
        final ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(3);
        executor.setQueueCapacity(500);
        executor.initialize();
        return executor;
    }
	
	
	private static Runnable threadLimpeza = new Runnable() {
		@Override
		public void run() {
			LimpezaDiaria limpeza = new LimpezaDiaria();
			while(true) {
				try {
					System.out.println("\n\n\n\nINICIANDO LIMPEZA DIARIA...");
					limpeza.cleanAllTemps();
					System.out.println("LIMPEZA FINALIZADA COM SUCESSO!\n\n\n");
					Thread.sleep(10000);
				}catch(Exception e) {
					System.out.println("\nERRO - LIMPEZA DIARIA NAO EXECUTADA!\n\n\n");
					System.out.println(e);
					try {
						Thread.sleep(10000);
					} catch (InterruptedException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
				}
			}
		}
	};
	*/
	
	/*
	@Bean
	public ServletRegistrationBean<DwrSpringServlet> dwrSpringServlet(){
		DwrSpringServlet dwrServlet = new DwrSpringServlet();
		
		ServletRegistrationBean<DwrSpringServlet> registrationBean = new ServletRegistrationBean<>(dwrServlet, "/dwr/*");
	
		registrationBean.addInitParameter("debug","true");
		registrationBean.addInitParameter("activeReverseAjaxEnabled", "true");
		return registrationBean;
	}*/
}
