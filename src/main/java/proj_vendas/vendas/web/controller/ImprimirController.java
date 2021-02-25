package proj_vendas.vendas.web.controller;

import java.text.DecimalFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.ImpressaoMatricial;
import proj_vendas.vendas.model.ImpressaoPedido;
import proj_vendas.vendas.model.Pagamento;
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

	@RequestMapping("/online/{codEmpresa}/{setor}")
	@ResponseBody
	public String impressaoNetBeans(@PathVariable int codEmpresa, @PathVariable String setor) {//modo online
		
		List<ImpressaoMatricial> todosIm = null;
		
		if(setor.equals("A") == true || setor.equals("C") == true || setor.equals("B") == true || setor.equals("M") == true) {
			todosIm = impressoes.findByCodEmpresaAndSetor(codEmpresa, setor);
		}else {
			todosIm = impressoes.findByCodEmpresa(codEmpresa);
		}
		
		if(todosIm.size() != 0) {
			ImpressaoMatricial im = todosIm.get(0);
			impressoes.deleteById(im.getId());
			return im.getImpressao();
		}
		return null;
	}
	
	
	public ImpressaoPedido receberEmpresa(ImpressaoPedido pedido, int codEmpresa) {
		Empresa empresa = empresas.findByCodEmpresa(codEmpresa);
		String endereco = empresa.getEndereco().getRua() + " " + empresa.getEndereco().getN() + ", " + empresa.getEndereco().getBairro();
		
		pedido.setCnpj(empresa.getCnpj());
		pedido.setEnderecoEmpresa(endereco);
		pedido.setNomeEstabelecimento(empresa.getNomeEstabelecimento().length() != 0 ? empresa.getNomeEstabelecimento() : "");
		pedido.setTexto1(empresa.getTexto1().length() != 0 ? empresa.getTexto1() : "");
		pedido.setTexto2(empresa.getTexto2().length() != 0 ? empresa.getTexto2() : "");
		pedido.setPromocao(empresa.getPromocao().length() != 0 ? empresa.getPromocao() : "");
		
		return pedido;
	}

	
	@RequestMapping("/imprimirPedido")
	@ResponseBody
	public void imprimirTudo(@RequestBody ImpressaoPedido pedido) {

		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		DecimalFormat decimal = new DecimalFormat("0.00");
		String impressaoCompleta;
		receberEmpresa(pedido, user.getCodEmpresa());
		
		impressaoCompleta = "\t" + cortaString(pedido.getNomeEstabelecimento()) + "#$"
							+ cortaString(pedido.getEnderecoEmpresa()) +                 "#$"
							+ "CNPJ: " + pedido.getCnpj() +           "#$"
							+ "----------------------------------------#$"
							+ "            CUPOM NAO FISCAL            #$"
							+ "----------------------------------------#$"
							+ "\t\t" + pedido.getEnvio() +          "#$#$"
							+ "----------- DADOS DO CLIENTE -----------#$"
							+ "Comanda: " + pedido.getComanda() +     "#$"
							+ "Cliente:#$" + cortaString(pedido.getNome()) + "#$";
		
		if(pedido.getEnvio().equals("ENTREGA"))
			impressaoCompleta += "Celular: " + pedido.getCelular() + "#$"
							+ cortaString(pedido.getEndereco())    + "#$"
							+ cortaString(pedido.getReferencia())    + "#$"
							+ "Taxa de entrega: \tR$ " + decimal.format(pedido.getTaxa()) + "#$";
					
		impressaoCompleta += "Hora: " + pedido.getHora() + "\tData: " + pedido.getData() + "#$"
							+ cortaString(pedido.getTexto1()) + "#$";

		//pizzas------------------------------------------------------------------------------------------
		if (pedido.getPizzas().length != 0) {
			impressaoCompleta += "----------------------------------------#$" 
							   + "\t\tPIZZAS#$"
								+ "QTD    PRODUTO         V.UNI    V.TOTAL#$#$";
			
			for (int i = 0; i < pedido.getPizzas().length; i++) {
				impressaoCompleta += limitaString(pedido.getPizzas()[i].getQtd(), 5) 
									+ "  "
									+ limitaString(pedido.getPizzas()[i].getSabor(), 14)
									+ "  "
									+ limitaString(decimal.format(Float.parseFloat(pedido.getPizzas()[i].getPreco())), 7)
									+ "  "
									+ limitaString(decimal.format(Float.parseFloat(pedido.getPizzas()[i].getPreco()) 
											/ Float.parseFloat(pedido.getPizzas()[i].getQtd())), 7)
									+ "#$";
				
				if (pedido.getPizzas()[i].getBorda() != "") impressaoCompleta += "Com " + limitaString(pedido.getPizzas()[i].getBorda(), 30) + "#$";
			}
		}

		if (pedido.getProdutos().length != 0) {
			impressaoCompleta += "----------------------------------------#$"
								+ "\t\tPRODUTOS#$"
								+ "QTD    PRODUTO         V.UNI    V.TOTAL#$#$";
			
			for (int i = 0; i < pedido.getProdutos().length; i++) {
				impressaoCompleta += limitaString(pedido.getProdutos()[i].getQtd(), 5)
									+ "  "
									+ limitaString(pedido.getProdutos()[i].getSabor(), 14)
									+ "  "
									+ limitaString(decimal.format(Float.parseFloat(pedido.getProdutos()[i].getPreco())), 7)
									+ "  "
									+ limitaString(decimal.format(Float.parseFloat(pedido.getProdutos()[i].getPreco()) 
										/ Float.parseFloat(pedido.getProdutos()[i].getQtd())), 7)
									+ "#$";
			}
		}

		impressaoCompleta += "----------------------------------------#$"
							+ "\t\tTOTAL#$";
				
		if(pedido.getEnvio().equals("ENTREGA")) {
			impressaoCompleta += "Total:          \tR$ " + decimal.format(pedido.getTotal()) + "#$"
							   + "Total com taxa: \tR$ " + decimal.format(pedido.getTotal() + pedido.getTaxa()) + "#$"
							   + "Levar:          \tR$ " + decimal.format(pedido.getTroco() - pedido.getTotal() - pedido.getTaxa()) + "#$";
		}else {
			impressaoCompleta += "Total:          \tR$ " + decimal.format(pedido.getTotal()) + "#$"
							   + "Levar:          \tR$ " + decimal.format(pedido.getTroco() - pedido.getTotal()) + "#$";
		}

		if(pedido.getTexto2() != "") impressaoCompleta += "----------------------------------------#$"
														+ "\tHORARIO DE FUNCIONAMENTO#$" 
														+ cortaString(pedido.getTexto2()) + "#$";
		
		if(pedido.getPromocao() != "") impressaoCompleta += "----------------------------------------#$"
														+ "\t\tPROMOCAO#$" 
														+ cortaString(pedido.getPromocao()) + "#$";
		
		if(pedido.getObs() != null) impressaoCompleta += "----------------------------------------#$"
														+ "\t\tOBSERVACAO#$" 
														+ cortaString(pedido.getObs()) + "#$";
		impressaoCompleta += "#$";
		imprimirLocal(impressaoCompleta, "A");
	}
	
	@RequestMapping("/imprimirPizza")
	@ResponseBody
	public void imprimirPizza(@RequestBody ImpressaoPedido pedido) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		receberEmpresa(pedido, user.getCodEmpresa());

		String impressaoCompleta;
		
		impressaoCompleta = "\t" + cortaString(pedido.getNomeEstabelecimento()) +  "#$"
							+ "----------------------------------------#$"
							+ "\t\t" + pedido.getEnvio() +            "#$"
							+ "Comanda: " + pedido.getComanda() +     "#$"
							+ "Cliente:#$"
							+ cortaString(pedido.getNome()) +         "#$";
		
		if (pedido.getPizzas().length != 0) {
			impressaoCompleta += "----------------------------------------#$"
								+ "\t\tPIZZAS#$"
								+ "QTD   PRODUTO#$#$";
			
			for (int i = 0; i < pedido.getPizzas().length; i++) {
				impressaoCompleta += limitaString(pedido.getPizzas()[i].getQtd(), 4)
									+ "  " 
									+ cortaString(pedido.getPizzas()[i].getSabor()) 
									+ "#$";
				if (pedido.getPizzas()[i].getBorda() != "") impressaoCompleta += "Com " + limitaString(pedido.getPizzas()[i].getBorda(), 40) + "#$";
				if (pedido.getPizzas()[i].getObs() != "") impressaoCompleta += "OBS: " + limitaString(pedido.getPizzas()[i].getObs(), 40) + "#$";
				impressaoCompleta += "#$";
			}
		}
		
		impressaoCompleta += "----------------------------------------#$"
							+ "Hora: " + pedido.getHora() + "\tData: " + pedido.getData() + "#$";

		impressaoCompleta += "#$";
		imprimirLocal(impressaoCompleta, pedido.getSetor());
	}
	
	
	@RequestMapping("/imprimirProduto")
	@ResponseBody
	public void imprimirProduto(@RequestBody ImpressaoPedido pedido) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		receberEmpresa(pedido, user.getCodEmpresa());

		String impressaoCompleta;
		
		impressaoCompleta = "\t" + cortaString(pedido.getNomeEstabelecimento()) +  "#$"
							+ "----------------------------------------#$"
							+ "\t\t" + pedido.getEnvio() +            "#$"
							+ "Comanda: " + pedido.getComanda() +     "#$"
							+ "Cliente:#$"
							+ cortaString(pedido.getNome()) +         "#$";
		
		if (pedido.getProdutos().length != 0) {
			impressaoCompleta += "----------------------------------------#$"
								+ "\t\tPRODUTOS#$"
								+ "QTD   PRODUTO#$#$";
			
			for (int i = 0; i < pedido.getProdutos().length; i++) {
				impressaoCompleta += limitaString(pedido.getProdutos()[i].getQtd(), 4)
									+ "  " 
									+ cortaString(pedido.getProdutos()[i].getSabor()) 
									+ "#$";
				if (pedido.getProdutos()[i].getObs() != "") impressaoCompleta += "OBS: " + limitaString(pedido.getProdutos()[i].getObs(), 40) + "#$";
				impressaoCompleta += "#$";
			}
		}
		
		impressaoCompleta += "----------------------------------------#$"
							+ "Hora: " + pedido.getHora() + "\tData: " + pedido.getData() + "#$";

		impressaoCompleta += "#$";
		imprimirLocal(impressaoCompleta, pedido.getSetor());
	}
	
	
	public void imprimirLocal(String impressaoCompleta, String setor) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		
		if(empresa.isImprimir() == true) {
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
				
			ImpressaoMatricial im = new ImpressaoMatricial();
			im.setImpressao(impressaoCompleta);
			im.setCodEmpresa(user.getCodEmpresa());
			im.setSetor(setor);
			impressoes.save(im);
		}
	}
	
	
	@RequestMapping("/imprimirLogFuncionario/{id}")
	@ResponseBody
	public void imprimirLogFuncionario(@RequestBody Pagamento pagamento, @PathVariable long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		
		DecimalFormat decimal = new DecimalFormat("0.00");
		
		//log usuario
		pagamento.setUsuario(user.getEmail());
		
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		Funcionario funcionario = funcionarios.findById(id).get();
		
		String impressaoCompleta;
		String endereco = empresa.getEndereco().getRua() + " " + empresa.getEndereco().getN() + ", " + empresa.getEndereco().getBairro();
		
		impressaoCompleta = "\t" + cortaString(empresa.getNomeEstabelecimento()) + "#$"
						  + cortaString(endereco) +                  "#$"
						  + "CNPJ: " + empresa.getCnpj() +           "#$"
						  + "----------------------------------------#$"
						  + "         REGISTRO DE PAGAMENTO          #$"
						  + "----------------------------------------#$"
						  + "Usuario logado: " + cortaString(pagamento.getUsuario()) + "#$"
						  + "Data: " + pagamento.getLogData() + "#$"
						  + "----------------------------------------#$"
						  + "Funcionario: " + cortaString(funcionario.getNome()) + "#$"
						  + "Cpf: " + funcionario.getCpf() + "#$"
						  + "Sob o cargo: " + cortaString(funcionario.getCargo()) + "#$";
		
		if(pagamento.getGastos() != 0) impressaoCompleta	+= "Gerou gastou de: R$ " + decimal.format(pagamento.getGastos()) + "#$";
		if(pagamento.getPago() != 0) impressaoCompleta	+= "Recebeu o vale de: R$ " + decimal.format(pagamento.getPago()) + "#$";
		if(pagamento.getHoras() != 0) impressaoCompleta	+= "Acrescentou em hora extra: R$ " + decimal.format(pagamento.getHoras()) + "#$";
		
		impressaoCompleta += "----------------------------------------#$";
		imprimirLocal(impressaoCompleta, "A");
	}
	
	
	@RequestMapping("/imprimirGeralFuncionario/{id}")
	@ResponseBody
	public void imprimirGeralFuncionario(@RequestBody List<Pagamento> pagamento, @PathVariable long id) {
		Usuario user = usuarios.findByEmail(((UserDetails)SecurityContextHolder.getContext()
				.getAuthentication().getPrincipal()).getUsername());
		

		DecimalFormat decimal = new DecimalFormat("0.00");
		
		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		Funcionario funcionario = funcionarios.findById(id).get();
		
		float total = 0, pago = 0, gasto = 0, hora = 0;
		String impressaoCompleta;
		String endereco = empresa.getEndereco().getRua() + " " + empresa.getEndereco().getN() + ", " + empresa.getEndereco().getBairro();
		
		impressaoCompleta = "\t" + cortaString(empresa.getNomeEstabelecimento()) + "#$"
						  + cortaString(endereco) +                  "#$"
						  + "CNPJ: " + empresa.getCnpj() +           "#$"
						  + "----------------------------------------#$"
						  + "         REGISTRO DE PAGAMENTO          #$"
						  + "----------------------------------------#$"
						  + "Usuario logado: " + cortaString(user.getEmail()) + "#$"
						  + "Data: " + pagamento.get(0).getLogData() + "#$"
						  + "----------------------------------------#$"
						  + "Funcionario: " + cortaString(funcionario.getNome()) + "#$"
						  + "Cpf: " + funcionario.getCpf() + "#$"
						  + "Sob o cargo: " + cortaString(funcionario.getCargo()) + "#$"
						  + "----------------------------------------#$";
		
		for(int i = 0; i<pagamento.size(); i++) {
			if(pagamento.get(i).getGastos() != 0) {
				impressaoCompleta += "Gerou gastou de: R$ " + decimal.format(pagamento.get(i).getGastos()) + "#$";
				gasto += pagamento.get(i).getGastos();
				total -= gasto;
			}
			if(pagamento.get(i).getPago() != 0) {
				impressaoCompleta += "Recebeu o vale de: R$ " + decimal.format(pagamento.get(i).getPago()) + "#$";
				pago += pagamento.get(i).getPago();
				total -= pago;
			}
			if(pagamento.get(i).getHoras() != 0) {
				impressaoCompleta += "Acrescentou em hora extra: R$ " + decimal.format(pagamento.get(i).getHoras()) + "#$";
				hora += pagamento.get(i).getHoras();
				total += hora;
			}
		}
		impressaoCompleta += "----------------------------------------#$"
						   + "                 TOTAL                  #$"
						   + "Gastos:     \t\tR$ " + decimal.format(gasto) + "#$"
						   + "Hora extra: \t\tR$ " + decimal.format(hora) +  "#$"
						   + "Pago:       \t\tR$ " + decimal.format(pago) +  "#$"
						   + "Total:      \t\tR$ " + decimal.format(total + funcionario.getSalario().floatValue()) + "#$"
						   + "----------------------------------------#$";

		impressaoCompleta += "#$";
		imprimirLocal(impressaoCompleta, "A");
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
