package proj_vendas.vendas.web.controller.Adm;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.ImpressaoMatricial;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Impressoes;
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
	private Impressoes impressoes;
	
	@Autowired
	private Empresas empresas;
	
	@Autowired
	private Usuarios usuarios;

	@GetMapping("/fechamento")
	public ModelAndView tela() {
		return new ModelAndView("fechamento");
	}
	
	@RequestMapping(value = "/fechamento/pedidos")
	@ResponseBody
	public List<Pedido> pedidos() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();

		return pedidos.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), dia, "FINALIZADO");
	}
	
	@RequestMapping(value = "/fechamento/dados")
	@ResponseBody
	public Dado dados() {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();

		return dados.findByCodEmpresaAndData(user.getCodEmpresa(), dia);
	}
	
	
	@RequestMapping(value = "/fechamento/finalizar/{trocoFinal}")
	@ResponseBody
	public Dado finalizarCaixa(@PathVariable double trocoFinal) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();
		
		//temp
		List<PedidoTemp> temp = temps.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), dia, "PRONTO");
		temps.deleteInBatch(temp);
		/*
		//pedidos
		List<Pedido> finalizados = pedidos.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), dia, "FINALIZADO");
		List<Pedido> excluidos = pedidos.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), dia, "EXCLUIDO");
		pedidos.deleteInBatch(finalizados);
		pedidos.deleteInBatch(excluidos);
		*/
		//buscar dado do dia
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), dia);
		dado.setTrocoFinal(trocoFinal);
		return dados.save(dado);
	}
	
	
	@RequestMapping("/fechamento/relatorio/{lucro}/{taxas}")
	public ModelAndView imprimirTudo(@PathVariable double lucro, @PathVariable double taxas) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());

		String dia = dias.findByCodEmpresa(user.getCodEmpresa()).getDia();
		List<Pedido> pedido = pedidos.findByCodEmpresaAndDataAndStatus(user.getCodEmpresa(), dia, "FINALIZADO");
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), dia);
		
		DecimalFormat decimal = new DecimalFormat("0.00");
		SimpleDateFormat format = new SimpleDateFormat ("hh:mm:ss dd/MM/yyyy");
		int entrega = 0, balcao = 0, mesa = 0, drive = 0;
		float total = 0, tEntrega = 0, tBalcao = 0, tMesa = 0, tDrive = 0;
		String impressaoCompleta;
		String endereco = empresa.getEndereco().getRua() + " " + empresa.getEndereco().getN() + ", " + empresa.getEndereco().getBairro();
		
		impressaoCompleta = "\t" + cortaString(empresa.getNomeEstabelecimento()) + "#$"
							+      cortaString(endereco) +                         "#$"
							+ "CNPJ: " + empresa.getCnpj() +          "#$"
							+ "----------------------------------------#$"
							+ "               RELATORIO                #$"
							+ "Data: " + format.format(new Date()) +  "#$";

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
						impressaoCompleta += "----------------------------------------#$"
										   + "\t\tENTREGA             #$"
								   		   + "CLIENTE         \tTOTAL #$";
						cont++;
					}
					impressaoCompleta += limitaString(pedido.get(i).getNome(), 15) 
										+ "\t\tR$ " + decimal.format(pedido.get(i).getTotal()) + "#$";
				}
				if(cont != 0 && i+1 == pedido.size()) {
					impressaoCompleta += "#$\t\tTotal: " + entrega + "#$";
				}
			}
			
			cont = 0;
			
			for(int i = 0; i<pedido.size(); i++) {
				if(pedido.get(i).getEnvio().equals("BALCAO") == true){
					if(cont == 0) {
						impressaoCompleta += "----------------------------------------#$"
										   + "\t\tBALCAO            #$"
								   		   + "CLIENTE         \tTOTAL #$";
						cont++;
					}
					impressaoCompleta += limitaString(pedido.get(i).getNome(), 15)
										+ "\t\tR$ " + decimal.format(pedido.get(i).getTotal()) + "#$";
				}
				if(cont != 0 && i+1 == pedido.size()) {
					impressaoCompleta += "#$\t\tTotal: " + balcao + "#$";
				}
			}

			cont = 0;
			
			for(int i = 0; i<pedido.size(); i++) {
				if(pedido.get(i).getEnvio().equals("MESA") == true){
					if(cont == 0) {
						impressaoCompleta += "----------------------------------------#$"
								   		   + "\t\tMESA              #$"
								   		   + "MESA            \tTOTAL #$";
						cont++;
					}
					impressaoCompleta += limitaString(pedido.get(i).getNome(), 15)
										+ "\t\tR$ " + decimal.format(pedido.get(i).getTotal()) + "#$";
				}
				if(cont != 0 && i+1 == pedido.size()) {
					impressaoCompleta += "#$\t\tTotal: " + mesa + "#$";
				}
			}
			
			cont = 0;
			
			for(int i = 0; i<pedido.size(); i++) {
				if(pedido.get(i).getEnvio().equals("DRIVE") == true){
					if(cont == 0) {
						impressaoCompleta += "----------------------------------------#$"
								   		   + "\t\tDRIVE THRU        #$"
								   		   + "CLIENTE         \tTOTAL #$";
						cont++;
					}
					impressaoCompleta += limitaString(pedido.get(i).getNome(), 15)
										+ "\t\tR$ " + decimal.format(pedido.get(i).getTotal()) + "#$";
				}
				if(cont != 0 && i+1 == pedido.size()) {
					impressaoCompleta += "#$\t\tTotal: " + drive + "#$";
				}
			}
		}
		
		impressaoCompleta += "----------------------------------------#$"
						   + "            TOTAL DE VENDAS             #$"
						   + "TROCO INICIAL \t\tR$ " + decimal.format(dado.getTrocoInicio()) + "#$"
						   + "TROCO FINAL   \t\tR$ " + decimal.format(dado.getTrocoFinal()) + "#$"
						   + "TAXAS PAGAS   \t\tR$ " + decimal.format(taxas) + "#$"
						   + "#$"
						   + "ENTREGAS:     \t\tR$ " + decimal.format(tEntrega) + "#$"
						   + "BALCOES:      \t\tR$ " + decimal.format(tBalcao) + "#$"
						   + "MESAS:        \t\tR$ " + decimal.format(tMesa) +  "#$"
						   + "DRIVES:       \t\tR$ " + decimal.format(tDrive) + "#$"
						   + "#$"
						   + "TOTAL EM TAXA:\t\tR$ " + decimal.format(tDrive) + "#$"
						   + "LUCRO BRUTO:  \t\tR$ " + decimal.format(total) +  "#$"
						   + "LUCRO LIQUIDO:\t\tR$ " + decimal.format(lucro) +  "#$";
			
		imprimirLocal(impressaoCompleta, "A");
		
		return new ModelAndView("fechamento");
	}
	
	public void imprimirLocal(String impressaoCompleta, String setor) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa()); //validar modo de impressao
		
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
                .replace("ú", "u")
                .replace("ì", "i");
		System.out.println(impressaoCompleta);
		if(empresa.isImpressoraOnline() == false) {

			//System.out.println("Modo offline");
			try {
                FileOutputStream fos1 = new FileOutputStream("LPT1");
                // Imprime o texto
                try (PrintStream ps1 = new PrintStream(fos1)) {
                    // Imprime o texto
                    ps1.print(impressaoCompleta );
                    // Fecha o Stream da impressora
                    ps1.close();
                }
            }catch(FileNotFoundException e) {
                try {
                    FileOutputStream fos2 = new FileOutputStream("LPT2");
                    // Imprime o texto
                    try (PrintStream ps2 = new PrintStream(fos2)) {
                        // Imprime o texto
                        ps2.print(impressaoCompleta);
                        // Fecha o Stream da impressora
                        ps2.close();
                    }
                }catch(FileNotFoundException e2) {
                	try {
                        FileOutputStream fos2 = new FileOutputStream("USB001");
                        // Imprime o texto
                        try (PrintStream ps2 = new PrintStream(fos2)) {
                            // Imprime o texto
                            ps2.print(impressaoCompleta);
                            // Fecha o Stream da impressora
                            ps2.close();
                        }
                    }catch(FileNotFoundException e3) {
                    	e3.printStackTrace();
                    }
                	e2.printStackTrace();
                }
                e.printStackTrace();
            }
		}else {
			ImpressaoMatricial im = new ImpressaoMatricial();
			im.setImpressao(impressaoCompleta);
			im.setCodEmpresa(user.getCodEmpresa());
			im.setSetor(setor);
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
		return (texto.length() <= limite) ? texto : texto.substring(0, limite) + "#$" + cortaString(texto.substring(limite));
	}
}
