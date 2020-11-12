package proj_vendas.vendas.web.controller.InicioController;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintStream;
import java.text.DecimalFormat;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Cliente;
import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Empresa;
import proj_vendas.vendas.model.ImpressaoPedido;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.model.Produto;
import proj_vendas.vendas.repository.Clientes;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
import proj_vendas.vendas.repository.Empresas;
import proj_vendas.vendas.repository.PedidoTemps;
import proj_vendas.vendas.repository.Pedidos;
import proj_vendas.vendas.repository.Produtos;

@Controller
@RequestMapping("/novoPedido")
public class NovoPedidoController {

	@Autowired
	private Pedidos pedidos;

	@Autowired
	private Produtos produtos;

	@Autowired
	private Clientes clientes;

	@Autowired
	private Dias dias;

	@Autowired
	private Dados dados;

	@Autowired
	private Empresas empresas;

	@Autowired
	private PedidoTemps temps;

	@RequestMapping("/**")
	public ModelAndView novoPedido() {
		return new ModelAndView("novoPedido");
	}

	@RequestMapping(value = "/numeroCliente/{celular}", method = RequestMethod.PUT)
	@ResponseBody
	public Cliente buscarCliente(@PathVariable String celular) {
		return clientes.findByCelular(celular);
	}

	@RequestMapping(value = "/nomeProduto/{nome}", method = RequestMethod.PUT)
	@ResponseBody
	public List<Produto> buscarProduto(@PathVariable String nome) {
		List<Produto> produto = produtos.findByCodigoBuscaAndDisponivelAndSetorNot(nome, true, "BORDA");// busca apenas
																										// 1 item
		if (produto.size() >= 1) {
			return produto;
		} else {// buscar se esta indisponivel
			List<Produto> produtoIndisponivel = produtos.findByCodigoBuscaAndDisponivelAndSetorNot(nome, false,
					"BORDA");// busca apenas 1 item
			if (produtoIndisponivel.size() != 0) {
				produtoIndisponivel.get(0).setId((long) -1);// codigo -1: nao disponivel
				return produtoIndisponivel;
			}
		}
		return produtos.findByNomeProdutoContainingAndDisponivelAndSetorNot(nome, true, "BORDA");// busca qualquer item
																									// relacionado
	}

	@RequestMapping(value = "/addProduto/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Produto> adicionarProduto(@PathVariable long id) {
		return produtos.findById(id);
	}

	@RequestMapping(value = "/bordas", method = RequestMethod.PUT)
	@ResponseBody
	public List<Produto> mostrarBordas() {
		return produtos.findAllBordas();
	}

	@RequestMapping(value = "/buscarBorda/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Produto> buscarBorda(@PathVariable Long id) {
		return produtos.findById(id);
	}

	@RequestMapping(value = "/salvarPedido", method = RequestMethod.PUT)
	@ResponseBody
	public Pedido novoPedido(@RequestBody Pedido pedido) {

		if (pedido.getId() == null) {// se o pedido ja existir
			Dia data = dias.buscarId1(); // buscar tabela dia de acesso
			Dado dado = dados.findByData(data.getDia()); // buscar dia nos dados

			pedido.setComanda((long) (dado.getComanda() + 1)); // salvar o numero do pedido
			dado.setComanda(dado.getComanda() + 1); // incrementar o n da comanda
			dados.save(dado); // autalizar n da comanda
		}
		return pedidos.save(pedido); // salvar pedido
	}

	@RequestMapping(value = "/editarPedido/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Pedido> buscarPedido(@PathVariable Long id) {
		return pedidos.findById(id);
	}

	@RequestMapping(value = "/atualizar", method = RequestMethod.PUT)
	@ResponseBody
	public Pedido atualizar(@RequestBody Pedido pedido) {
		Dia data = dias.buscarId1(); // buscar tabela dia de acesso

		Pedido antigo = pedidos.findByNomeAndDataAndStatusNotAndStatusNot(pedido.getNome(), data.getDia(), "FINALIZADO",
				"EXCLUIDO");
		if (antigo == null) {
			return new Pedido();
		}
		return antigo;
	}

	@RequestMapping(value = "/salvarTemp", method = RequestMethod.PUT)
	@ResponseBody
	public void salvarTemp(@RequestBody PedidoTemp temp) {
		temps.save(temp);
	}

	@RequestMapping(value = "/excluirPedidosTemp/{comanda}", method = RequestMethod.PUT)
	@ResponseBody
	public void excluirPedido(@ModelAttribute("comanda") Pedido pedido) {
		List<PedidoTemp> temp = temps.findByComanda(pedido.getComanda());
		temps.deleteInBatch(temp);
	}

	@RequestMapping(value = "/data", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Dia> data() {
		return dias.findById((long) 1);
	}

	@RequestMapping(value = "/empresa", method = RequestMethod.PUT)
	@ResponseBody
	public Empresa editar() {
		return empresas.buscarId1();
	}

	@RequestMapping("/imprimirTudo")
	@ResponseBody
	public void imprimirTudo(@RequestBody ImpressaoPedido pedido) {
		
		DecimalFormat decimal = new DecimalFormat("0.00");
		String impressaoCompleta;
		impressaoCompleta ="\n\n--------------------\n\t" + pedido.getNomeEstabelecimento() 
					+ "\n\t" + pedido.getEnvio() 
					+ "\n--------------------"
					+ "\n\tDados do cliente"
					+ "\nComanda: " + pedido.getComanda() 
					+ "\nCliente: " + pedido.getNome();
		
		if(pedido.getEnvio().equals("ENTREGA"))
			impressaoCompleta += "\n\nCelular: " + pedido.getCelular() 
					+ "\n" + pedido.getEndereco() 
					+ "\nTaxa de entrega: R$ " + decimal.format(pedido.getTaxa());
					
		impressaoCompleta += "\nHora: " + pedido.getHora() 
					+ "   Data: " + pedido.getData()
					+ "\n\n" + pedido.getTexto1();

		if (pedido.getPizzas().length != 0) {
			impressaoCompleta += "\n\n--------------------\n\tPizzas";
			
			for (int i = 0; i < pedido.getPizzas().length; i++) {
				impressaoCompleta += "\n\n- " + pedido.getPizzas()[i].getQtd() + " x " + pedido.getPizzas()[i].getSabor();
				if (pedido.getPizzas()[i].getBorda() != "") impressaoCompleta += "\nCom " + pedido.getPizzas()[i].getBorda();
				
				impressaoCompleta += "\nv. Total: R$ " + decimal.format(Float.parseFloat(pedido.getPizzas()[i].getPreco()))
								+ "\nv. Uni: R$ " + decimal.format(Float.parseFloat(pedido.getPizzas()[i].getPreco()) 
										/ Float.parseFloat(pedido.getPizzas()[i].getQtd()));
				
			}
		}

		if (pedido.getProdutos().length != 0) {
			impressaoCompleta += "\n\n--------------------\n\tProdutos";
			
			for (int i = 0; i < pedido.getProdutos().length; i++) {
				impressaoCompleta += "\n\n- " + pedido.getProdutos()[i].getQtd() + " x " + pedido.getProdutos()[i].getSabor()
								+ "\nv. Total: R$ " + decimal.format(Float.parseFloat(pedido.getProdutos()[i].getPreco()))
								+ "\nv. Uni: R$ " + decimal.format(Float.parseFloat(pedido.getProdutos()[i].getPreco()) 
										/ Float.parseFloat(pedido.getProdutos()[i].getQtd()));
			}
		}

		if(pedido.getEnvio().equals("ENTREGA")) {
			impressaoCompleta += "\n\n--------------------\nTotal com taxa: R$ " + decimal.format(pedido.getTotal() + pedido.getTaxa())
			+ "\nLevar: R$ " + decimal.format(pedido.getTroco() - pedido.getTotal() - pedido.getTaxa());
		}else {
			impressaoCompleta += "\n\n--------------------\nTotal: R$ " + decimal.format(pedido.getTotal())
			+ "\nLevar: R$ " + decimal.format(pedido.getTroco() - pedido.getTotal());
		}
		
		if(pedido.getTexto2() != "")impressaoCompleta += "\n\n" + pedido.getTexto2();
		if(pedido.getPromocao() != "") impressaoCompleta += "\n\n--------------------\n\tPromoção\n" + pedido.getPromocao();
		
		System.out.println(impressaoCompleta);
		
		//salvar arquivo
		 FileWriter fw;
		try {
			fw = new FileWriter(new File("C:\\Users\\Public\\Documents\\impressaoTemp.txt"));
			BufferedWriter buffer = new BufferedWriter(fw);
			 
			buffer.write(impressaoCompleta);
			  
			 buffer.close();
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		
		//impressora matricial
		try { 
			FileOutputStream lpt1 = new FileOutputStream("LPT1");
			PrintStream impressora = new PrintStream(lpt1);
		
			// Imprime o texto 
			impressora.print("\n\nSistema GazalTech\n"); 
			impressora.print(impressaoCompleta); 
			//Quebra linha
			
			impressora.print("\n\n\n\f");
			
			// Fecha o Stream da impressora 
			impressora.close();
			lpt1.close();
			
		}catch(IOException e) {
			e.printStackTrace();
		}
		
	}
	
	@RequestMapping("/imprimirPizza")
	@ResponseBody
	public void imprimirPizza(@RequestBody ImpressaoPedido pedido) {

		String impressaoCompleta;
		impressaoCompleta ="\n\n--------------------\n\t" + pedido.getNomeEstabelecimento() 
					+ "\n\t" + pedido.getEnvio() 
					+ "\n--------------------"
					+ "\nComanda: " + pedido.getComanda() 
					+ "\nCliente: " + pedido.getNome();
		
		if (pedido.getPizzas().length != 0) {
			impressaoCompleta += "\n\n--------------------\n\tPizzas";
			
			for (int i = 0; i < pedido.getPizzas().length; i++) {
				impressaoCompleta += "\n\n- " + pedido.getPizzas()[i].getQtd() + " x " + pedido.getPizzas()[i].getSabor();
				if (pedido.getPizzas()[i].getBorda() != "") impressaoCompleta += "\nCom " + pedido.getPizzas()[i].getBorda();
				if (pedido.getPizzas()[i].getObs() != "") impressaoCompleta += "\nOBS: " + pedido.getPizzas()[i].getObs();
			}
		}
		
		impressaoCompleta += "\n\n--------------------\nHora: " + pedido.getHora() 
					+ "   Data: " + pedido.getData();

		System.out.println(impressaoCompleta);
		
		//impressora matricial
		try { 
			FileOutputStream lpt1 = new FileOutputStream("LPT1");
			PrintStream impressora = new PrintStream(lpt1);
		
			// Imprime o texto 
			impressora.print("\n\nSistema GazalTech\n"); 
			impressora.print(impressaoCompleta); 
			//Quebra linha
			
			impressora.print("\n\n\n\f");
			
			// Fecha o Stream da impressora 
			impressora.close();
			lpt1.close();
		}catch(IOException e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping("/imprimirProduto")
	@ResponseBody
	public void imprimirProduto(@RequestBody ImpressaoPedido pedido) {

		String impressaoCompleta;
		impressaoCompleta ="\n\n--------------------\n\t" + pedido.getNomeEstabelecimento() 
					+ "\n\t" + pedido.getEnvio() 
					+ "\n--------------------"
					+ "\nComanda: " + pedido.getComanda() 
					+ "\nCliente: " + pedido.getNome();
		
		if (pedido.getProdutos().length != 0) {
			impressaoCompleta += "\n\n--------------------\n\tProdutos";
			
			for (int i = 0; i < pedido.getProdutos().length; i++) {
				impressaoCompleta += "\n\n- " + pedido.getProdutos()[i].getQtd() + " x " + pedido.getProdutos()[i].getSabor();
				if (pedido.getProdutos()[i].getObs() != "") impressaoCompleta += "\nOBS: " + pedido.getProdutos()[i].getObs();
			}
		}

		System.out.println(impressaoCompleta);
		
		//impressora matricial
		try { 
			FileOutputStream lpt1 = new FileOutputStream("LPT1");
			PrintStream impressora = new PrintStream(lpt1);
		
			// Imprime o texto 
			impressora.print("\n\nSistema GazalTech\n"); 
			impressora.print(impressaoCompleta); 
			//Quebra linha
			
			impressora.print("\n\n\n\f");
			
			// Fecha o Stream da impressora 
			impressora.close();
			lpt1.close();
		}catch(IOException e) {
			e.printStackTrace();
		}
	}
}

/*
 * //salvar arquivo
 * FileWriter fw = new FileWriter(new
 * File("C:\\impressaoTemp.txt"));
 * 
 * BufferedWriter buffer = new BufferedWriter(fw);
 * 
 * buffer.write(texto.getPizzas());
 * 
 * buffer.close();
 * 
 * //enviar para impressora String defaultPrinter =
 * PrintServiceLookup.lookupDefaultPrintService().getName();
 * System.out.println("Default printer: " + defaultPrinter);
 * 
 * PrintService service = PrintServiceLookup.lookupDefaultPrintService();
 * 
 * FileInputStream in = new FileInputStream(new File("..\\impressaoTemp.txt"));
 * 
 * PrintRequestAttributeSet pras = new HashPrintRequestAttributeSet();
 * pras.add(new Copies(1));
 * 
 * DocFlavor flavor = DocFlavor.INPUT_STREAM.AUTOSENSE; Doc doc = new
 * SimpleDoc(in, flavor, null);
 * 
 * DocPrintJob job = service.createPrintJob(); job.print(doc, pras);
 */