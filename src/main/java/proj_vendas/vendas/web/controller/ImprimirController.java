package proj_vendas.vendas.web.controller;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.Funcionario;
import proj_vendas.vendas.model.ImpressaoMatricial;
import proj_vendas.vendas.model.ImpressaoPedido;
import proj_vendas.vendas.model.LogMotoboy;
import proj_vendas.vendas.model.Pagamento;
import proj_vendas.vendas.model.Sangria;
import proj_vendas.vendas.model.Usuario;
import proj_vendas.vendas.repository.Dados;
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

	@Autowired
	private Dados dados;

	@RequestMapping("/online/{codEmpresa}/{setor}")
	@ResponseBody
	public String impressaoNetBeans(@PathVariable int codEmpresa, @PathVariable String setor) {// modo online
		SimpleDateFormat validar = new SimpleDateFormat("yyyy-MM-dd kk:mm");

		List<ImpressaoMatricial> todosIm = null;

		if (setor.equals("A") || setor.equals("C") /*|| setor.contains("M")*/) {
			todosIm = impressoes.findByCodEmpresaAndSetor(codEmpresa, setor);
		} else {
			todosIm = impressoes.findByCodEmpresa(codEmpresa);
		}

		//validar
		for (int i = 0; i < todosIm.size(); i++) {
			if (todosIm.get(i).getValidade().compareTo(validar.format(new Date()).toString()) < 0) {
				impressoes.deleteById(todosIm.get(i).getId());
				todosIm.remove(i);
			}
		}

		if (todosIm.size() != 0) {
			ImpressaoMatricial im = todosIm.get(0);
			impressoes.deleteById(im.getId());
			return im.getImpressao();
		}
		return null;
	}

	public ImpressaoPedido receberEmpresa(ImpressaoPedido pedido, int codEmpresa) {
		Empresa empresa = empresas.findByCodEmpresa(codEmpresa);
		String endereco = empresa.getEndereco().getRua() + " " + empresa.getEndereco().getN() + ", "
				+ empresa.getEndereco().getBairro();

		pedido.setCnpj(empresa.getCnpj());
		pedido.setEnderecoEmpresa(endereco);
		pedido.setNomeEstabelecimento(
				empresa.getNomeEstabelecimento().length() != 0 ? empresa.getNomeEstabelecimento() : "");
		pedido.setTexto1(empresa.getTexto1().length() != 0 ? empresa.getTexto1() : "");
		pedido.setTexto2(empresa.getTexto2().length() != 0 ? empresa.getTexto2() : "");
		pedido.setPromocao(empresa.getPromocao().length() != 0 ? empresa.getPromocao() : "");

		return pedido;
	}

	@RequestMapping("/imprimirPedido")
	@ResponseBody
	public ImpressaoPedido imprimirTudo(@RequestBody ImpressaoPedido pedido) {

		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		DecimalFormat decimal = new DecimalFormat("0.00");
		String impressaoCompleta = "";
		receberEmpresa(pedido, user.getCodEmpresa());

		impressaoCompleta = "\t" + cortaString(pedido.getNomeEstabelecimento()) + "#$"
				+ cortaString(pedido.getEnderecoEmpresa()) + "#$" + "CNPJ: " + pedido.getCnpj() + "#$"
				+ "----------------------------------------#$" + "            CUPOM NAO FISCAL            #$"
				+ "----------------------------------------#$" + "\t\t" + pedido.getEnvio() + "#$#$"
				+ "----------- DADOS DO CLIENTE -----------#$" + "Comanda: " + pedido.getComanda() + "#$" + "Cliente:#$"
				+ cortaString(pedido.getNome()) + "#$";

		if (pedido.getEnvio().equals("ENTREGA"))
			impressaoCompleta += "Celular:  " + pedido.getCelular() + "#$" + "Endereco:" + "#$"
					+ cortaString(pedido.getEndereco()) + "#$"
					+ (pedido.getReferencia() != ""
							? ("Referencia:" + "#$" + cortaString(pedido.getReferencia()) + "#$")
							: "")
					+ "#$Taxa de entrega: \tR$ " + decimal.format(pedido.getTaxa()) + "#$"
					+ (pedido.getMotoboy() != null ? ("Motoboy:  " + limitaString(pedido.getMotoboy(), 30) + "#$")
							: "");

		if (pedido.getEnvio().equals("MESA"))
			impressaoCompleta += (pedido.getGarcon() != null
					? "Garcon:   " + limitaString(pedido.getGarcon(), 30) + "#$"
					: "");

		if (!pedido.getEnvio().equals("ENTREGA"))
			impressaoCompleta += (pedido.getAc() != null ? "Atendente:  " + limitaString(pedido.getAc(), 28) + "#$"
					: "");

		impressaoCompleta += "Data: " + pedido.getHoraPedido() + "#$" + cortaString(pedido.getTexto1()) + "#$";

		// pizzas------------------------------------------------------------------------------------------
		if (pedido.getPizzas().length != 0) {
			impressaoCompleta += "----------------------------------------#$" + "\t\tPIZZAS#$"
					+ "QTD    PRODUTO         V.UNI    V.TOTAL#$#$";

			for (int i = 0; i < pedido.getPizzas().length; i++) {
				impressaoCompleta += limitaString(pedido.getPizzas()[i].getQtd(), 5) + "  "
						+ limitaString(pedido.getPizzas()[i].getSabor(), 14) + "  "
						+ limitaString(decimal.format(Float.parseFloat(pedido.getPizzas()[i].getPreco())), 7) + "  "
						+ limitaString(decimal.format(Float.parseFloat(pedido.getPizzas()[i].getPreco())
								/ Float.parseFloat(pedido.getPizzas()[i].getQtd())), 7)
						+ "#$";

				if (pedido.getPizzas()[i].getBorda() != "")
					impressaoCompleta += "Com " + limitaString(pedido.getPizzas()[i].getBorda(), 30) + "#$";
			}
		}

		if (pedido.getProdutos().length != 0) {
			impressaoCompleta += "----------------------------------------#$" + "\t\tPRODUTOS#$"
					+ "QTD    PRODUTO         V.UNI    V.TOTAL#$#$";

			for (int i = 0; i < pedido.getProdutos().length; i++) {
				impressaoCompleta += limitaString(pedido.getProdutos()[i].getQtd(), 5) + "  "
						+ limitaString(pedido.getProdutos()[i].getSabor(), 14) + "  "
						+ limitaString(decimal.format(Float.parseFloat(pedido.getProdutos()[i].getPreco())), 7) + "  "
						+ limitaString(decimal.format(Float.parseFloat(pedido.getProdutos()[i].getPreco())
								/ Float.parseFloat(pedido.getProdutos()[i].getQtd())), 7)
						+ "#$";
			}
		}

		impressaoCompleta += "----------------------------------------#$" + "\tTOTAL DO PEDIDO #$";

		if (pedido.getEnvio().equals("ENTREGA")) {
			impressaoCompleta += "Total:          \tR$ " + decimal.format(pedido.getTotal() + pedido.getTaxa()) + "#$"
					+ "Levar:          \tR$ " + decimal.format(pedido.getTroco() - pedido.getTotal() - pedido.getTaxa())
					+ "#$";
		} else if (pedido.getEnvio().equals("MESA")) {
			impressaoCompleta += "Total:          \tR$ " + decimal.format(pedido.getTotal() + pedido.getServico())
					+ "#$" + "Levar:          \tR$ "
					+ decimal.format(pedido.getTroco() - (pedido.getTotal() + pedido.getServico())) + "#$"
					+ "Servicos:       \tR$ " + decimal.format(pedido.getServico());
		} else {
			impressaoCompleta += "Total:          \tR$ " + decimal.format(pedido.getTotal()) + "#$"
					+ "Levar:          \tR$ " + decimal.format(pedido.getTroco() - pedido.getTotal()) + "#$";
		}

		impressaoCompleta += "Pedido pago?    \t" + (pedido.isPago() == true ? "Sim" : "Nao") + "#$"
				+ (pedido.getModoPagamento() != null
						? "Modo pagamento:  " + cortaString(pedido.getModoPagamento()) + "#$"
						: "");

		if (pedido.getTexto2() != "")
			impressaoCompleta += "----------------------------------------#$" + "\tHORARIO DE FUNCIONAMENTO#$"
					+ cortaString(pedido.getTexto2()) + "#$";

		if (pedido.getPromocao() != "")
			impressaoCompleta += "----------------------------------------#$" + "\t\tPROMOCAO#$"
					+ cortaString(pedido.getPromocao()) + "#$";

		if (pedido.getObs() != null)
			impressaoCompleta += "----------------------------------------#$" + "\t\tOBSERVACAO#$"
					+ cortaString(pedido.getObs()) + "#$";
		impressaoCompleta += "#$";
		imprimirLocal(impressaoCompleta, "A");

		return pedido;
	}

	@RequestMapping("/imprimirProduto")
	@ResponseBody
	public void imprimirProdutos(@RequestBody ImpressaoPedido pedido) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		receberEmpresa(pedido, user.getCodEmpresa());

		String impressaoCompleta = "";

		impressaoCompleta = "\t" + cortaString(pedido.getNomeEstabelecimento()) + "#$"
				+ "----------------------------------------#$" + "\t\t" + pedido.getEnvio() + "#$" + "Comanda: "
				+ pedido.getComanda() + "#$" + "Cliente:" + "#$" + cortaString(pedido.getNome()) + "#$";

		//pizzas
		if (pedido.getPizzas().length != 0) {
			impressaoCompleta += "----------------------------------------#$" + "\t\tPIZZAS#$" + "QTD   PRODUTO#$#$";

			for (int i = 0; i < pedido.getPizzas().length; i++) {
				impressaoCompleta += limitaString(pedido.getPizzas()[i].getQtd(), 4) + "  "
						+ cortaString(pedido.getPizzas()[i].getSabor()) + "#$";
				if (pedido.getPizzas()[i].getBorda() != "")
					impressaoCompleta += "Com " + limitaString(pedido.getPizzas()[i].getBorda(), 40) + "#$";
				if (pedido.getPizzas()[i].getObs() != "")
					impressaoCompleta += "OBS: " + limitaString(pedido.getPizzas()[i].getObs(), 40) + "#$";
				impressaoCompleta += "#$";
			}
		}
		
		//produtos
		if (pedido.getProdutos().length != 0) {
			impressaoCompleta += "----------------------------------------#$" + "\t\tPRODUTOS#$" + "QTD   PRODUTO#$#$";

			for (int i = 0; i < pedido.getProdutos().length; i++) {
				impressaoCompleta += limitaString(pedido.getProdutos()[i].getQtd(), 4) + "  "
						+ cortaString(pedido.getProdutos()[i].getSabor()) + "#$";
				if (pedido.getProdutos()[i].getObs() != "")
					impressaoCompleta += "OBS: " + limitaString(pedido.getProdutos()[i].getObs(), 40) + "#$";
				impressaoCompleta += "#$";
			}
		}

		impressaoCompleta += "----------------------------------------#$" + "Data: " + pedido.getHoraPedido() + "#$";

		impressaoCompleta += "#$";
		imprimirLocal(impressaoCompleta, pedido.getSetor());
	}

	@RequestMapping("/imprimirLogFuncionario/{id}")
	@ResponseBody
	public void imprimirLogFuncionario(@RequestBody Pagamento pagamento, @PathVariable long id) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		DecimalFormat decimal = new DecimalFormat("0.00");

		// log usuario
		pagamento.setUsuario(user.getEmail());

		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		Funcionario funcionario = funcionarios.findById(id).get();

		String impressaoCompleta = "";
		String endereco = empresa.getEndereco().getRua() + " " + empresa.getEndereco().getN() + ", "
				+ empresa.getEndereco().getBairro();

		impressaoCompleta = "\t" + cortaString(empresa.getNomeEstabelecimento()) + "#$" + cortaString(endereco) + "#$"
				+ "CNPJ: " + empresa.getCnpj() + "#$" + "----------------------------------------#$"
				+ "         REGISTRO DE PAGAMENTO          #$" + "----------------------------------------#$"
				+ "Usuario logado: " + cortaString(pagamento.getUsuario()) + "#$" + "Data: " + pagamento.getLogData()
				+ "#$" + "----------------------------------------#$" + "Funcionario: "
				+ cortaString(funcionario.getNome()) + "#$" + "Cpf: " + funcionario.getCpf() + "#$" + "Sob o cargo: "
				+ cortaString(funcionario.getCargo()) + "#$";

		if (pagamento.getDiarias() != 0)
			impressaoCompleta += "Recebeu em diaria: R$ " + decimal.format(pagamento.getDiarias()) + "#$";
		if (pagamento.getGastos() != 0)
			impressaoCompleta += "Gerou gastos de: R$ " + decimal.format(pagamento.getGastos()) + "#$";
		if (pagamento.getPago() != 0)
			impressaoCompleta += "Recebeu o pagamento de: R$ " + decimal.format(pagamento.getPago()) + "#$";
		if (pagamento.getHoras() != 0)
			impressaoCompleta += "Acrescentou em hora extra: R$ " + decimal.format(pagamento.getHoras()) + "#$";

		impressaoCompleta += "----------------------------------------#$";
		imprimirLocal(impressaoCompleta, "A");
	}

	@RequestMapping("/imprimirGeralFuncionario/{id}")
	@ResponseBody
	public void imprimirGeralFuncionario(@RequestBody List<Pagamento> pagamento, @PathVariable long id) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		DecimalFormat decimal = new DecimalFormat("0.00");

		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		Funcionario funcionario = funcionarios.findById(id).get();

		float total = 0, pago = 0, gasto = 0, hora = 0, diaria = 0;
		String impressaoCompleta = "";
		String endereco = empresa.getEndereco().getRua() + " " + empresa.getEndereco().getN() + ", "
				+ empresa.getEndereco().getBairro();

		impressaoCompleta = "\t" + cortaString(empresa.getNomeEstabelecimento()) + "#$" + cortaString(endereco) + "#$"
				+ "CNPJ: " + empresa.getCnpj() + "#$" + "----------------------------------------#$"
				+ "         REGISTRO DE PAGAMENTO          #$" + "----------------------------------------#$"
				+ "Usuario logado: " + cortaString(user.getEmail()) + "#$" + "Data: " + pagamento.get(0).getLogData()
				+ "#$" + "----------------------------------------#$" + "Funcionario: "
				+ cortaString(funcionario.getNome()) + "#$" + "Cpf: " + funcionario.getCpf() + "#$" + "Sob o cargo: "
				+ cortaString(funcionario.getCargo()) + "#$" + "----------------------------------------#$";

		for (int i = 0; i < pagamento.size(); i++) {
			if (pagamento.get(i).getDiarias() != 0) {
				impressaoCompleta += "Recebeu em diaria: R$ " + decimal.format(pagamento.get(i).getGastos()) + "#$";
				diaria += pagamento.get(i).getDiarias();
				total -= diaria;
			}
			if (pagamento.get(i).getGastos() != 0) {
				impressaoCompleta += "Gerou gastos de: R$ " + decimal.format(pagamento.get(i).getGastos()) + "#$";
				gasto += pagamento.get(i).getGastos();
				total -= gasto;
			}
			if (pagamento.get(i).getPago() != 0) {
				impressaoCompleta += "Recebeu o pagamento de: R$ " + decimal.format(pagamento.get(i).getPago()) + "#$";
				pago += pagamento.get(i).getPago();
				total -= pago;
			}
			if (pagamento.get(i).getHoras() != 0) {
				impressaoCompleta += "Acrescentou em hora extra: R$ " + decimal.format(pagamento.get(i).getHoras())
						+ "#$";
				hora += pagamento.get(i).getHoras();
				total += hora;
			}
		}
		impressaoCompleta += "----------------------------------------#$" + "                 TOTAL                  #$"
				+ "Diarias:    \t\tR$ " + decimal.format(diaria) + "#$" + "Gastos:     \t\tR$ " + decimal.format(gasto)
				+ "#$" + "Horas extra:\t\tR$ " + decimal.format(hora) + "#$" + "Pago:       \t\tR$ "
				+ decimal.format(pago) + "#$" + "Total:      \t\tR$ "
				+ decimal.format(total + funcionario.getSalario().floatValue()) + "#$"
				+ "----------------------------------------#$";

		impressaoCompleta += "#$";
		imprimirLocal(impressaoCompleta, "A");
	}

	@RequestMapping("/relatorioFechamento")
	public ModelAndView imprimirTudo() {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());
		Dado dado = dados.findByCodEmpresaAndData(user.getCodEmpresa(), user.getDia());

		DecimalFormat decimal = new DecimalFormat("0.00");
		SimpleDateFormat format = new SimpleDateFormat("kk:mm:ss dd/MM/yyyy");
		String impressaoCompleta = "";
		String endereco = empresa.getEndereco().getRua() + " " + empresa.getEndereco().getN() + ", "
				+ empresa.getEndereco().getBairro();

		impressaoCompleta = "\t" + cortaString(empresa.getNomeEstabelecimento()) + "#$" + cortaString(endereco) + "#$"
				+ "CNPJ: " + empresa.getCnpj() + "#$" + "----------------------------------------#$"
				+ "               RELATORIO                #$" + "Data: " + format.format(new Date()) + "#$"
				+ "----------------------------------------#$" + dado.getClientes() + "#$";

		impressaoCompleta += "----------------------------------------#$" + "            TOTAL DE VENDAS             #$"
				+ "TROCO INICIAL \t\tR$ " + decimal.format(dado.getTrocoInicio()) + "#$" + "TROCO FINAL   \t\tR$ "
				+ decimal.format(dado.getTrocoFinal()) + "#$" + "#$" + "TAXAS PAGAS   \t\tR$ "
				+ decimal.format(calcularTaxaMotoboy(dado.getLogMotoboy())) + "#$" + "#$" + "ENTREGAS:     \t\tR$ "
				+ decimal.format(dado.getVenda_entrega()) + "#$" + "BALCOES:      \t\tR$ "
				+ decimal.format(dado.getVenda_balcao()) + "#$" + "MESAS:        \t\tR$ "
				+ decimal.format(dado.getVenda_mesa()) + "#$" + "DRIVE-THRU:   \t\tR$ "
				+ decimal.format(dado.getVenda_drive()) + "#$" + "#$" + "LUCRO BRUTO:  \t\tR$ "
				+ decimal.format(dado.getTotalVendas()) + "#$" + "LUCRO LIQUIDO:\t\tR$ "
				+ decimal.format(dado.getTotalLucro()) + "#$" + "#$" + "SANGRIA:      \t\tR$ "
				+ decimal.format(calcularSangria(dado.getSangria())) + "#$" + "#$" + "TOTAL CAIXA:  \t\tR$ "
				+ decimal.format((dado.getTotalVendas() + dado.getTrocoInicio()) - calcularSangria(dado.getSangria()))
				+ "#$";

		imprimirLocal(impressaoCompleta, "A");

		return new ModelAndView("fechamento");
	}

	private float calcularSangria(List<Sangria> sangria) {
		int i;
		float total = 0;

		for (i = 0; i < sangria.size(); i++) {
			total += sangria.get(i).getValor();
		}
		return total;
	}

	private float calcularTaxaMotoboy(List<LogMotoboy> logMotoboy) {
		float totalTaxa = 0;

		if (logMotoboy.size() != 0)
			for (int i = 0; i < logMotoboy.size(); i++) {
				totalTaxa += logMotoboy.get(i).getTaxa();
			}
		return totalTaxa;
	}

	private void imprimirLocal(String impressaoCompleta, String setor) {
		Usuario user = usuarios.findByEmail(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());

		Empresa empresa = empresas.findByCodEmpresa(user.getCodEmpresa());

		SimpleDateFormat data = new SimpleDateFormat("yyyy-MM-dd kk");
		SimpleDateFormat minutoString = new SimpleDateFormat("mm");
		int minutoInt = Integer.parseInt(minutoString.format(new Date()));

		if (empresa.isImprimir() == true) {
			impressaoCompleta = impressaoCompleta.replace("ç", "c").replace("á", "a").replace("ã", "a")
					.replace("à", "a").replace("Á", "A").replace("À", "A").replace("ó", "o").replace("õ", "o")
					.replace("ô", "o").replace("ò", "o").replace("é", "e").replace("ê", "e").replace("è", "e")
					.replace("í", "i").replace("ú", "u").replace("ì", "i");

			ImpressaoMatricial im = new ImpressaoMatricial();
			// permite 4 minutos;
			minutoInt += 2;

			im.setValidade(data.format(new Date()) + ":" + minutoInt);
			im.setImpressao(impressaoCompleta);
			im.setCodEmpresa(user.getCodEmpresa());
			im.setSetor(setor);
			impressoes.save(im);
		}
	}

	private String limitaString(String texto, int limite) {
		String vazio = "                              ";
		if (texto.length() < limite)
			texto += vazio;
		return (texto.length() <= limite) ? texto : texto.substring(0, limite);
	}

	private String cortaString(String texto) {
		int limite = 40;
		return (texto.length() <= limite) ? texto
				: texto.substring(0, limite) + "#$" + cortaString(texto.substring(limite));
	}
}
