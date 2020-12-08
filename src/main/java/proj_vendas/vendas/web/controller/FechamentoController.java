package proj_vendas.vendas.web.controller;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.ImpressaoMatricial;
import proj_vendas.vendas.model.LogUsuario;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Impressoes;
import proj_vendas.vendas.repository.LogUsuarios;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Usuarios;

@Controller
@RequestMapping("adm")
public class FechamentoController {

	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Dias dias;
	
	@Autowired
	private Dados dados;
	
	@Autowired
	private PedidoTemps temps;
	
	@Autowired
	private LogUsuarios logUsuarios;

	@Autowired
	private Impressoes impressoes;
	
	@Autowired
	private Empresas empresas;
	
	@Autowired
	private Usuarios usuarios;

	@GetMapping("/fechamento")
	public ModelAndView tela() {
		return new ModelAndView("fechamento");
	}
	
	@RequestMapping(value = "/fechamento/Tpedidos")
	@ResponseBody
	public long totalPedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();
		return pedidos.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), dia, "FINALIZADO").size();
	}
	
	@RequestMapping(value = "/fechamento/Tvendas")
	@ResponseBody
	public List<Pedido> totalVendas() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();

		return pedidos.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), dia, "FINALIZADO");
	}
	
	@RequestMapping(value = "/fechamento/buscarIdData/{data}")
	@ResponseBody
	public Dado buscarId(@PathVariable String data) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		return dados.findByCodEmpresaAndData(user.getCodEmpresa(), data);
	}
	
	@RequestMapping(value = "/fechamento/finalizar")
	@ResponseBody
	public Dado finalizarCaixa(@RequestBody Dado dado) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		//log
		LogUsuario log = new LogUsuario();
		Date hora = new Date();

		log.setUsuario(user.getEmail());
		log.setAcao("Fechamento de caixa");
		log.setData(hora.toString());
		log.setCodEmpresa(user.getCodEmpresa());
		
		logUsuarios.save(log); //salvar logUsuario
				
		Dia data = dias.findByCodEmpresa(user.getCodEmpresa()); //buscar tabela dia de acesso
		List<PedidoTemp> temp = temps.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), data.getDia(), "PRONTO");
		temps.deleteInBatch(temp);
		
		dado.setCodEmpresa(user.getCodEmpresa());
		return dados.save(dado);
	}
	
	@RequestMapping(value = "/fechamento/data")
	@ResponseBody
	public Optional<Dia> data() {
		return dias.findById((long) 1);
	}
	
	@RequestMapping("/fechamento/relatorio/{lucro}")
	public ModelAndView imprimirTudo(@PathVariable float lucro) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());

		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();
		List<Pedido> pedido = pedidos.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), dia, "FINALIZADO");
		
		DecimalFormat decimal = new DecimalFormat("0.00");
		int entrega = 0, balcao = 0, mesa = 0, drive = 0;
		float total = 0, tEntrega = 0, tBalcao = 0, tMesa = 0, tDrive = 0;
		String impressaoCompleta;
		String endereco = empresa.getEndereco().getRua() + " " + empresa.getEndereco().getN() + ", " + empresa.getEndereco().getBairro();
		
		impressaoCompleta = "\t" + cortaString(empresa.getNomeEstabelecimento()) + "\r"
							+      cortaString(endereco) +                         "\r"
							+ "CNPJ: " + empresa.getCnpj() +          "\r"
							+ "----------------------------------------\r"
							+ "               RELATORIO                \r"
							+ "Data: " + new Date() +                 "\r";

		for(int i = 0; i<pedido.size(); i++) {
			total += pedido.get(i).getTotal();
			if(pedido.get(i).getEnvio().equals("ENTREGA")){
				tEntrega += pedido.get(i).getTotal();
				entrega++;
			}
			if(pedido.get(i).getEnvio().equals("MESA")){
				tMesa += pedido.get(i).getTotal();
				mesa++;
			}
			if(pedido.get(i).getEnvio().equals("BALCAO")){
				tBalcao += pedido.get(i).getTotal();
				balcao++;
			}
			if(pedido.get(i).getEnvio().equals("DRIVE")){
				tDrive += pedido.get(i).getTotal();
				drive++;
			}
		}
		
		if(pedido.size() != 0) {
			int cont = 0;
			for(int i = 0; i<pedido.size(); i++) {
				if(pedido.get(i).getEnvio().equals("ENTREGA") == true){
					if(cont == 0) {
						impressaoCompleta += "----------------------------------------\r"
										   + "\t\tENTREGA             \r"
								   		   + "CLIENTE         \tTOTAL \r";
						cont++;
					}
					impressaoCompleta += limitaString(pedido.get(i).getNome(), 15) 
										+ "\t\tR$ " + decimal.format(pedido.get(i).getTotal()) + "\r";
				}
				if(cont != 0 && i+1 == pedido.size()) {
					impressaoCompleta += "\r\t\tTotal: " + entrega + "\r";
				}
			}
			
			cont = 0;
			
			for(int i = 0; i<pedido.size(); i++) {
				if(pedido.get(i).getEnvio().equals("BALCAO") == true){
					if(cont == 0) {
						impressaoCompleta += "----------------------------------------\r"
										   + "\t\tBALCAO            \r"
								   		   + "CLIENTE         \tTOTAL \r";
						cont++;
					}
					impressaoCompleta += limitaString(pedido.get(i).getNome(), 15)
										+ "\t\tR$ " + decimal.format(pedido.get(i).getTotal()) + "\r";
				}
				if(cont != 0 && i+1 == pedido.size()) {
					impressaoCompleta += "\r\t\tTotal: " + balcao + "\r";
				}
			}

			cont = 0;
			
			for(int i = 0; i<pedido.size(); i++) {
				if(pedido.get(i).getEnvio().equals("MESA") == true){
					if(cont == 0) {
						impressaoCompleta += "----------------------------------------\r"
								   		   + "\t\tMESA              \r"
								   		   + "MESA            \tTOTAL \r";
						cont++;
					}
					impressaoCompleta += limitaString(pedido.get(i).getNome(), 15)
										+ "\t\tR$ " + decimal.format(pedido.get(i).getTotal()) + "\r";
				}
				if(cont != 0 && i+1 == pedido.size()) {
					impressaoCompleta += "\r\t\tTotal: " + mesa + "\r";
				}
			}
			
			cont = 0;
			
			for(int i = 0; i<pedido.size(); i++) {
				if(pedido.get(i).getEnvio().equals("DRIVE") == true){
					if(cont == 0) {
						impressaoCompleta += "----------------------------------------\r"
								   		   + "\t\tDRIVE THRU        \r"
								   		   + "CLIENTE         \tTOTAL \r";
						cont++;
					}
					impressaoCompleta += limitaString(pedido.get(i).getNome(), 15)
										+ "\t\tR$ " + decimal.format(pedido.get(i).getTotal()) + "\r";
				}
				if(cont != 0 && i+1 == pedido.size()) {
					impressaoCompleta += "\r\t\tTotal: " + drive + "\r";
				}
			}
		}
		
		impressaoCompleta += "----------------------------------------\r"
						   + "            TOTAL DE VENDAS             \r"
						   + "ENTREGAS:     \t\tR$ " + decimal.format(tEntrega) + "\r"
						   + "BALCOES:      \t\tR$ " + decimal.format(tBalcao) +   "\r"
						   + "MESAS:        \t\tR$ " + decimal.format(tMesa) +       "\r"
						   + "DRIVES:       \t\tR$ " + decimal.format(tDrive) +   "\r\r"
						   + "LUCRO BRUTO:  \t\tR$ " + decimal.format(total) + "\r"
						   + "LUCRO LIQUIDO:\t\tR$ " + decimal.format(lucro) + "\r";
			
		imprimirLocal(impressaoCompleta);
		
		return new ModelAndView("fechamento");
	}
	
	public void imprimirLocal(String impressaoCompleta) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());

		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		
		impressaoCompleta = impressaoCompleta
                .replace("ç", "c")
                .replace("á", "a")
                .replace("ã", "a")
                .replace("à", "a")
                .replace("Á", "A")
                .replace("À", "A")
                .replace("ó", "o")
                .replace("õ", "o")
                .replace("ô", "o")
                .replace("ò", "o")
                .replace("é", "e")
                .replace("ê", "e")
                .replace("è", "e")
                .replace("í", "i")
                .replace("ì", "i");
		
		if(empresa.isImpressoraOnline() == false) {
			System.out.println("\n\n\n");
			System.out.println(impressaoCompleta);
			//System.out.println("Modo offline");
			try {
                FileOutputStream fos1 = new FileOutputStream("LPT1");
                // Imprime o texto
                try (PrintStream ps1 = new PrintStream(fos1)) {
                    // Imprime o texto
                    ps1.print(impressaoCompleta + "\n\n\n\n\n\n\n\n");
                    // Fecha o Stream da impressora
                    ps1.close();
                }
            }catch(FileNotFoundException e) {
                try {
                    FileOutputStream fos2 = new FileOutputStream("LPT2");
                    // Imprime o texto
                    try (PrintStream ps2 = new PrintStream(fos2)) {
                        // Imprime o texto
                        ps2.print(impressaoCompleta + "\n\n\n\n\n\n\n\n");
                        // Fecha o Stream da impressora
                        ps2.close();
                    }
                }catch(FileNotFoundException e2) {
                	//e2.printStackTrace();
                }
                //e.printStackTrace();
            }
		}else {
			System.out.println("Modo online");
			ImpressaoMatricial im = new ImpressaoMatricial();
			im.setImpressao(impressaoCompleta);
			im.setCodEmpresa(user.getCodEmpresa());
			impressoes.save(im);
		}
	}
	
	public String limitaString(String texto, int limite) {
		
		String vazio = "                              ";
		if(texto.length() < limite) texto += vazio;
		return (texto.length() <= limite) ? texto : texto.substring(0, limite);
	}
	
	public String cortaString(String texto) {
		int limite = 40;
		return (texto.length() <= limite) ? texto : texto.substring(0, limite) + "\r" + cortaString(texto.substring(limite));
	}
}
