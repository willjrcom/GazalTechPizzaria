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
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Impressoes;
import proj_vendas.vendas.repository.LogUsuarios;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Pedidos;

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
	private LogUsuarios usuarios;

	@Autowired
	private Impressoes impressoes;
	
	@Autowired
	private Empresas empresas;
	
	@GetMapping("/fechamento")
	public ModelAndView tela() {
		return new ModelAndView("fechamento");
	}
	
	@RequestMapping(value = "/fechamento/Tpedidos")
	@ResponseBody
	public long totalPedidos() {
		String dia = dias.buscarId1().getDia();
		return pedidos.findByStatusAndData("FINALIZADO", dia).size();
	}
	
	@RequestMapping(value = "/fechamento/Tvendas")
	@ResponseBody
	public List<Pedido> totalVendas() {
		String dia = dias.buscarId1().getDia();
		return pedidos.findByStatusAndData("FINALIZADO", dia);
	}
	
	@RequestMapping(value = "/fechamento/baixartudo")
	@ResponseBody
	public List<Pedido> baixarTudo() {
		String dia = dias.buscarId1().getDia();
		return pedidos.findByStatusAndData("FINALIZADO", dia);
	}
	
	@RequestMapping(value = "/fechamento/buscarIdData/{data}")
	@ResponseBody
	public Dado buscarId(@PathVariable String data) {
		return dados.findByData(data);
	}
	
	@RequestMapping(value = "/fechamento/finalizar")
	@ResponseBody
	public Dado finalizarCaixa(@RequestBody Dado dado) {
		//log
		LogUsuario log = new LogUsuario();
		Date hora = new Date();
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal(); //buscar usuario logado
		log.setUsuario(((UserDetails)principal).getUsername());
		log.setAcao("Fechamento de caixa");
		log.setData(hora.toString());
		
		usuarios.save(log); //salvar logUsuario
				
		Dia data = dias.buscarId1(); //buscar tabela dia de acesso
		List<PedidoTemp> temp = temps.findByStatusAndData("PRONTO", data.getDia());
		temps.deleteInBatch(temp);
		return dados.save(dado);
	}
	
	@RequestMapping(value = "/fechamento/data")
	@ResponseBody
	public Optional<Dia> data() {
		return dias.findById((long) 1);
	}
	
	@RequestMapping("/fechamento/imprimirTudo")
	public void imprimirTudo() {
		Empresa empresa = empresas.buscarId1();

		String dia = dias.buscarId1().getDia();
		List<Pedido> pedido = pedidos.findByStatusAndData("FINALIZADO", dia);
		
		DecimalFormat decimal = new DecimalFormat("0.00");
		int entrega = 0, balcao = 0, mesa = 0, drive = 0;
		float total = 0, tEntrega = 0, tBalcao = 0, tMesa = 0, tDrive = 0;
		String impressaoCompleta;
		String endereco = empresa.getEndereco().getRua() + " " + empresa.getEndereco().getN() + ", " + empresa.getEndereco().getBairro();
		
		impressaoCompleta = "\t" + empresa.getNomeEstabelecimento() + "\r"
							+      endereco +                         "\r"
							+ "CNPJ: " + empresa.getCnpj() +          "\r"
							+ "----------------------------------------\r"
							+ "               RELATORIO                \r"
							+ "Data: " + new Date() +                 "\r"
							+ "----------------------------------------\r";

		for(int i = 0; i<pedido.size(); i++) {
			total += pedido.get(i).getTotal();
			if(pedido.get(i).getEnvio().equals("ENTREGA")){
				entrega++;
			}
			if(pedido.get(i).getEnvio().equals("MESA")){
				mesa++;
			}
			if(pedido.get(i).getEnvio().equals("BALCAO")){
				balcao++;
			}
			if(pedido.get(i).getEnvio().equals("DRIVE")){
				drive++;
			}
		}
		
		if(pedido.size() != 0) {
			for(int i = 0; i<pedido.size(); i++) {
				if(pedido.get(i).getEnvio().equals("ENTREGA")){
					if(i == 0 && entrega != 0) {
						impressaoCompleta += "----------------------------------------\r"
										   + "\t\tENTREGA                             \r"
								   		   + "    CLIENTE                    TOTAL    \r";
					}
					impressaoCompleta += pedido.get(i).getNome() + "\t" + decimal.format(pedido.get(i).getTotal()) + "\r";
				}
			}
			
			for(int i = 0; i<pedido.size(); i++) {
				if(pedido.get(i).getEnvio().equals("BALCAO")){
					if(i == 0 && balcao != 0) {
						impressaoCompleta += "----------------------------------------\r"
										   + "\t\tBALCAO                              \r"
								   		   + "    CLIENTE                    TOTAL    \r";
					}
					impressaoCompleta += pedido.get(i).getNome() + "\t" + decimal.format(pedido.get(i).getTotal()) + "\r";
				}
			}
			
			for(int i = 0; i<pedido.size(); i++) {
				if(pedido.get(i).getEnvio().equals("MESA")){
					if(i == 0 && mesa != 0) {
						impressaoCompleta += "----------------------------------------\r"
								   		   + "\t\tMESA                                \r"
								   		   + "    MESA                       TOTAL    \r";
					}
					impressaoCompleta += pedido.get(i).getNome() + "\t" + decimal.format(pedido.get(i).getTotal()) + "\r";
				}
			}
			
			for(int i = 0; i<pedido.size(); i++) {
				if(pedido.get(i).getEnvio().equals("DRIVE")){
					if(i == 0 && drive != 0) {
						impressaoCompleta += "----------------------------------------\r"
								   		   + "\t\tDRIVE THRU                          \r"
								   		   + "    CLIENTE                    TOTAL    \r";
					}
					impressaoCompleta += pedido.get(i).getNome() + "\t" + decimal.format(pedido.get(i).getTotal()) + "\r";
				}
			}
		}
		
		impressaoCompleta += "----------------------------------------\r"
						   + "                 TOTAL                  \r"
						   + "Entregas: " + tEntrega +               "\r"
						   + "BALCOES: " + tBalcao +                 "\r"
						   + "MESAS: " + tMesa +                     "\r"
						   + "DRIVES: " + tDrive +                   "\r"
						   + "TOTAL GERAL: " + total +               "\r";
						
		imprimirLocal(impressaoCompleta);
	}
	
	public void imprimirLocal(String impressaoCompleta) {
		Empresa empresa = empresas.findAll().get(0); //validar modo de impressao
		
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
			impressoes.save(im);
		}
	}
}
