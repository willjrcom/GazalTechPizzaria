package proj_vendas.vendas.web.controller;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.text.DecimalFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.ImpressaoMatricial;
import proj_vendas.vendas.model.ImpressaoPedido;
import proj_vendas.vendas.model.Salario;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.Funcionarios;
import proj_vendas.vendas.repository.Impressoes;
import proj_vendas.vendas.repository.Usuarios;

@RestController
@RequestMapping("/imprimir")
public class ImprimirController {
	
	@Autowired
	private Impressoes impressoes;
	
	@Autowired
	private Funcionarios funcionarios;
	
	@Autowired
	private Empresas empresas;
	
	@Autowired
	private Usuarios usuarios;

	@RequestMapping("/online")
	public String impressaoNetBeans() {//modo online
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		List<ImpressaoMatricial> todosIm = impressoes.findByCodEmpresa(user.getCodEmpresa());
		if(todosIm.size() != 0) {
			ImpressaoMatricial im = todosIm.get(0);
			impressoes.deleteById(im.getId());
			return im.getImpressao();
		}
		return null;
	}
	

	@RequestMapping("/imprimirPedido")
	@ResponseBody
	public void imprimirTudo(@RequestBody ImpressaoPedido pedido) {
		
		DecimalFormat decimal = new DecimalFormat("0.00");
		String impressaoCompleta;
		impressaoCompleta = "\t" + cortaString(pedido.getNomeEstabelecimento()) + "\r"
							+ cortaString(pedido.getEnderecoEmpresa()) +          "\r"
							+ "CNPJ: " + pedido.getCnpj() +           "\r"
							+ "----------------------------------------\r"
							+ "            CUPOM NAO FISCAL            \r"
							+ "----------------------------------------\r"
							+ "\t\t" + pedido.getEnvio() +          "\r\r"
							+ "----------- DADOS DO CLIENTE -----------\r"
							+ "Comanda: " + pedido.getComanda() +     "\r"
							+ "Cliente:\r" + cortaString(pedido.getNome()) + "\r";
		
		if(pedido.getEnvio().equals("ENTREGA"))
			impressaoCompleta += "Celular: " + pedido.getCelular() + "\r"
							+ cortaString(pedido.getEndereco()) + "\r"
							+ "Taxa de entrega: \tR$ " + decimal.format(pedido.getTaxa()) + "\r";
					
		impressaoCompleta += "Hora: " + pedido.getHora() + "\tData: " + pedido.getData() + "\r\r"
							+ cortaString(pedido.getTexto1()) + "\r";

		//pizzas------------------------------------------------------------------------------------------
		if (pedido.getPizzas().length != 0) {
			impressaoCompleta += "----------------------------------------\r" 
							   + "\t\tPIZZAS\r"
								+ "QTD    PRODUTO         V.UNI    V.TOTAL\r\r";
			
			for (int i = 0; i < pedido.getPizzas().length; i++) {
				impressaoCompleta += limitaString(pedido.getPizzas()[i].getQtd(), 5) 
									+ "  "
									+ limitaString(pedido.getPizzas()[i].getSabor(), 14)
									+ "  "
									+ limitaString(decimal.format(Float.parseFloat(pedido.getPizzas()[i].getPreco())), 7)
									+ "  "
									+ limitaString(decimal.format(Float.parseFloat(pedido.getPizzas()[i].getPreco()) 
											/ Float.parseFloat(pedido.getPizzas()[i].getQtd())), 7)
									+ "\r";
				
				if (pedido.getPizzas()[i].getBorda() != "") impressaoCompleta += "Com " + limitaString(pedido.getPizzas()[i].getBorda(), 30) + "\r";
			}
		}

		if (pedido.getProdutos().length != 0) {
			impressaoCompleta += "----------------------------------------\r"
								+ "\t\tPRODUTOS\r"
								+ "QTD    PRODUTO         V.UNI    V.TOTAL\r\r";
			
			for (int i = 0; i < pedido.getProdutos().length; i++) {
				impressaoCompleta += limitaString(pedido.getProdutos()[i].getQtd(), 5)
									+ "  "
									+ limitaString(pedido.getProdutos()[i].getSabor(), 14)
									+ "  "
									+ limitaString(decimal.format(Float.parseFloat(pedido.getProdutos()[i].getPreco())), 7)
									+ "  "
									+ limitaString(decimal.format(Float.parseFloat(pedido.getProdutos()[i].getPreco()) 
										/ Float.parseFloat(pedido.getProdutos()[i].getQtd())), 7)
									+ "\r";
			}
		}

		impressaoCompleta += "----------------------------------------\r"
							+ "\t\tTOTAL\r";
				
		if(pedido.getEnvio().equals("ENTREGA")) {
			impressaoCompleta += "Total:          \tR$ " + decimal.format(pedido.getTotal()) + "\r"
							   + "Total com taxa: \tR$ " + decimal.format(pedido.getTotal() + pedido.getTaxa()) + "\r"
							   + "Levar:          \tR$ " + decimal.format(pedido.getTroco() - pedido.getTotal() - pedido.getTaxa()) + "\r";
		}else {
			impressaoCompleta += "Total:          \tR$ " + decimal.format(pedido.getTotal()) + "\r"
							   + "Levar:          \tR$ " + decimal.format(pedido.getTroco() - pedido.getTotal()) + "\r";
		}

		if(pedido.getTexto2() != "") impressaoCompleta += "----------------------------------------\r"
														+ "\tHORARIO DE FUNCIONAMENTO\r" 
														+ cortaString(pedido.getTexto2()) + "\r";
		
		if(pedido.getPromocao() != "") impressaoCompleta += "----------------------------------------\r"
														+ "\t\tPROMOCAO\r" 
														+ cortaString(pedido.getPromocao()) + "\r";
		
		if(pedido.getObs() != null) impressaoCompleta += "----------------------------------------\r"
														+ "\t\tOBSERVACAO\r" 
														+ cortaString(pedido.getObs()) + "\r";
		
		imprimirLocal(impressaoCompleta);
	}
	
	@RequestMapping("/imprimirPizza")
	@ResponseBody
	public void imprimirPizza(@RequestBody ImpressaoPedido pedido) {

		String impressaoCompleta;
		
		impressaoCompleta = "\t" + cortaString(pedido.getNomeEstabelecimento()) +  "\r"
							+ "----------------------------------------\r"
							+ "\t\t" + pedido.getEnvio() +            "\r"
							+ "Comanda: " + pedido.getComanda() +     "\r"
							+ "Cliente:\r"
							+ cortaString(pedido.getNome()) +         "\r";
		
		if (pedido.getPizzas().length != 0) {
			impressaoCompleta += "----------------------------------------\r"
								+ "\t\tPIZZAS\r"
								+ "QTD   PRODUTO\r\r";
			
			for (int i = 0; i < pedido.getPizzas().length; i++) {
				impressaoCompleta += limitaString(pedido.getPizzas()[i].getQtd(), 4)
									+ "  " 
									+ cortaString(pedido.getPizzas()[i].getSabor()) 
									+ "\r";
				if (pedido.getPizzas()[i].getBorda() != "") impressaoCompleta += "Com " + limitaString(pedido.getPizzas()[i].getBorda(), 30) + "\r";
				if (pedido.getPizzas()[i].getObs() != "") impressaoCompleta += "OBS: " + limitaString(pedido.getPizzas()[i].getObs(), 30) + "\r";
				impressaoCompleta += "\r";
			}
		}
		
		impressaoCompleta += "----------------------------------------\r"
							+ "Hora: " + pedido.getHora() + "\tData: " + pedido.getData() + "\r";

		imprimirLocal(impressaoCompleta);
	}
	
	@RequestMapping("/imprimirProduto")
	@ResponseBody
	public void imprimirProduto(@RequestBody ImpressaoPedido pedido) {

		String impressaoCompleta;
		
		impressaoCompleta = "\t" + cortaString(pedido.getNomeEstabelecimento()) +  "\r"
							+ "----------------------------------------\r"
							+ "\t\t" + pedido.getEnvio() +            "\r"
							+ "Comanda: " + pedido.getComanda() +     "\r"
							+ "Cliente:\r"
							+ cortaString(pedido.getNome()) +         "\r";
		
		if (pedido.getProdutos().length != 0) {
			impressaoCompleta += "----------------------------------------\r"
								+ "\t\tPRODUTOS\r"
								+ "QTD   PRODUTO\r\r";
			
			for (int i = 0; i < pedido.getProdutos().length; i++) {
				impressaoCompleta += limitaString(pedido.getProdutos()[i].getQtd(), 4)
									+ "  " 
									+ cortaString(pedido.getProdutos()[i].getSabor()) 
									+ "\r";
				if (pedido.getProdutos()[i].getObs() != "") impressaoCompleta += "OBS: " + limitaString(pedido.getProdutos()[i].getObs(), 30) + "\r";
				impressaoCompleta += "\r";
			}
		}
		
		impressaoCompleta += "----------------------------------------\r"
							+ "Hora: " + pedido.getHora() + "\tData: " + pedido.getData() + "\r";
		
		imprimirLocal(impressaoCompleta);
	}
	
	public void imprimirLocal(String impressaoCompleta) {
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
                    ps1.print(impressaoCompleta + "\r\r\r\r\r\r\r");
                    // Fecha o Stream da impressora
                    ps1.close();
                }
            }catch(FileNotFoundException e) {
                try {
                    FileOutputStream fos2 = new FileOutputStream("LPT2");
                    // Imprime o texto
                    try (PrintStream ps2 = new PrintStream(fos2)) {
                        // Imprime o texto
                        ps2.print(impressaoCompleta + "\r\r\r\r\r\r\r");
                        // Fecha o Stream da impressora
                        ps2.close();
                    }
                }catch(FileNotFoundException e2) {
                	//e2.printStackTrace();
                }
                //e.printStackTrace();
            }
		}else {
			ImpressaoMatricial im = new ImpressaoMatricial();
			im.setImpressao(impressaoCompleta);
			im.setCodEmpresa(user.getCodEmpresa());
			impressoes.save(im);
		}
	}
	
	@RequestMapping("/imprimirLogFuncionario")
	@ResponseBody
	public void imprimirLogFuncionario(@RequestBody Salario salario) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		

		DecimalFormat decimal = new DecimalFormat("0.00");
		
		//log usuario
		salario.setUsuario(user.getEmail());
		
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		Funcionario funcionario = funcionarios.findById((long)salario.getIdFuncionario()).get();
		
		String impressaoCompleta;
		String endereco = empresa.getEndereco().getRua() + " " + empresa.getEndereco().getN() + ", " + empresa.getEndereco().getBairro();
		
		impressaoCompleta = "\t" + cortaString(empresa.getNomeEstabelecimento()) + "\r"
						  + cortaString(endereco) +                  "\r"
						  + "CNPJ: " + empresa.getCnpj() +           "\r"
						  + "----------------------------------------\r"
						  + "         REGISTRO DE PAGAMENTO          \r"
						  + "----------------------------------------\r"
						  + "Usuario logado: " + cortaString(salario.getUsuario()) + "\r"
						  + "Data: " + salario.getLogData() + "\r"
						  + "----------------------------------------\r"
						  + "Funcionario: " + cortaString(funcionario.getNome()) + "\r"
						  + "Cpf: " + funcionario.getCpf() + "\r"
						  + "Sob o cargo: " + cortaString(funcionario.getCargo()) + "\r";
		
		if(salario.getGastos() != 0) impressaoCompleta	+= "Gerou gastou de: R$ " + decimal.format(salario.getGastos()) + "\r";
		if(salario.getPago() != 0) impressaoCompleta	+= "Recebeu o vale de: R$ " + decimal.format(salario.getPago()) + "\r";
		if(salario.getHoras() != 0) impressaoCompleta	+= "Acrescentou em hora extra: R$ " + decimal.format(salario.getHoras()) + "\r";
		
		impressaoCompleta += "----------------------------------------\r";
		imprimirLocal(impressaoCompleta);
	}
	
	@RequestMapping("/imprimirGeralFuncionario")
	@ResponseBody
	public void imprimirGeralFuncionario(@RequestBody List<Salario> salario) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		

		DecimalFormat decimal = new DecimalFormat("0.00");
		
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		Funcionario funcionario = funcionarios.findById((long)salario.get(0).getIdFuncionario()).get();
		
		float total = 0, pago = 0, gasto = 0, hora = 0;
		String impressaoCompleta;
		String endereco = empresa.getEndereco().getRua() + " " + empresa.getEndereco().getN() + ", " + empresa.getEndereco().getBairro();
		
		impressaoCompleta = "\t" + cortaString(empresa.getNomeEstabelecimento()) + "\r"
						  + cortaString(endereco) +                  "\r"
						  + "CNPJ: " + empresa.getCnpj() +           "\r"
						  + "----------------------------------------\r"
						  + "         REGISTRO DE PAGAMENTO          \r"
						  + "----------------------------------------\r"
						  + "Usuario logado: " + cortaString(user.getEmail()) + "\r"
						  + "Data: " + salario.get(0).getLogData() + "\r"
						  + "----------------------------------------\r"
						  + "Funcionario: " + cortaString(funcionario.getNome()) + "\r"
						  + "Cpf: " + funcionario.getCpf() + "\r"
						  + "Sob o cargo: " + cortaString(funcionario.getCargo()) + "\r"
						  + "----------------------------------------\r";
		
		for(int i = 0; i<salario.size(); i++) {
			if(salario.get(i).getGastos() != 0) {
				impressaoCompleta += "Gerou gastou de: R$ " + decimal.format(salario.get(i).getGastos()) + "\r";
				gasto += salario.get(i).getGastos();
				total -= gasto;
			}
			if(salario.get(i).getPago() != 0) {
				impressaoCompleta += "Recebeu o vale de: R$ " + decimal.format(salario.get(i).getPago()) + "\r";
				pago += salario.get(i).getPago();
				total -= pago;
			}
			if(salario.get(i).getHoras() != 0) {
				impressaoCompleta += "Acrescentou em hora extra: R$ " + decimal.format(salario.get(i).getHoras()) + "\r";
				hora += salario.get(i).getHoras();
				total += hora;
			}
		}
		impressaoCompleta += "----------------------------------------\r"
						   + "                 TOTAL                  \r"
						   + "Gastos:     \t\tR$ " + decimal.format(gasto) + "\r"
						   + "Hora extra: \t\tR$ " + decimal.format(hora) +  "\r"
						   + "Pago:       \t\tR$ " + decimal.format(pago) +  "\r"
						   + "Total:      \t\tR$ " + decimal.format(total + funcionario.getSalario().floatValue()) + "\r"
						   + "----------------------------------------\r";
		imprimirLocal(impressaoCompleta);
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
