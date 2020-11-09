package proj_vendas.vendas.web.controller.InicioController;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import javax.print.Doc;
import javax.print.DocFlavor;
import javax.print.DocPrintJob;
import javax.print.PrintException;
import javax.print.PrintService;
import javax.print.PrintServiceLookup;
import javax.print.SimpleDoc;
import javax.print.attribute.HashPrintRequestAttributeSet;
import javax.print.attribute.PrintRequestAttributeSet;
import javax.print.attribute.standard.Copies;

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
	
	@RequestMapping(value = "/addProduto/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Produto> adicionarProduto(@PathVariable long id) {
		return produtos.findById(id);
	}
	
	@RequestMapping(value = "/numeroCliente/{celular}", method = RequestMethod.PUT)
	@ResponseBody
	public Cliente buscarCliente(@PathVariable String celular) {
		return clientes.findByCelular(celular);
	}
	
	@RequestMapping(value = "/nomeProduto/{nome}", method = RequestMethod.PUT)
	@ResponseBody
	public List<Produto> buscarProduto(@PathVariable String nome) {
		List<Produto> produto = produtos.findByCodigoBuscaAndDisponivelAndSetorNot(nome, true, "BORDA");//busca apenas 1 item
		if(produto.size() >= 1) {
			return produto;
		}else {//buscar se esta indisponivel
			List<Produto> produtoIndisponivel = produtos.findByCodigoBuscaAndDisponivelAndSetorNot(nome, false, "BORDA");//busca apenas 1 item
			if(produtoIndisponivel.size() != 0) {
				produtoIndisponivel.get(0).setId((long) -1);//codigo -1: nao disponivel
				return produtoIndisponivel;
			}
		}
		return produtos.findByNomeProdutoContainingAndDisponivelAndSetorNot(nome, true, "BORDA");//busca qualquer item relacionado
	}
	
	@RequestMapping(value = "/salvarPedido", method = RequestMethod.PUT)
	@ResponseBody
	public Pedido novoPedido(@RequestBody Pedido pedido) {
		
		if(pedido.getId() == null) {//se o pedido ja existir
			Dia data = dias.buscarId1(); //buscar tabela dia de acesso
			Dado dado = dados.findByData(data.getDia()); //buscar dia nos dados
			
			pedido.setComanda((long)(dado.getComanda() + 1)); //salvar o numero do pedido
			dado.setComanda(dado.getComanda() + 1); //incrementar o n da comanda
			dados.save(dado); //autalizar n da comanda
		}
		return pedidos.save(pedido); //salvar pedido
	}
	
	@RequestMapping(value = "/salvarTemp", method = RequestMethod.PUT)
	@ResponseBody
	public void salvarTemp(@RequestBody PedidoTemp temp) {
		Dia data = dias.buscarId1(); //buscar tabela dia de acesso
		Dado dado = dados.findByData(data.getDia()); //buscar dia nos dados
		temp.setComanda((long)(dado.getComanda()));
	}
	
	@RequestMapping(value = "/editarPedido/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Pedido> buscarPedido(@PathVariable Long id) {
		return pedidos.findById(id);
	}
	
	@RequestMapping(value = "/atualizarPedido/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Pedido atualizarPedido(@RequestBody Pedido pedido) {
		return pedidos.save(pedido);
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
	
	@RequestMapping(value = "/data", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Dia> data() {
		return dias.findById((long) 1);
	}
	
	@RequestMapping(value = "/apagarTemp/{comanda}", method = RequestMethod.PUT)
	@ResponseBody
	public String apagarTemp(@PathVariable Long comanda) {
		Pedido pedido = pedidos.findByComanda(comanda);
		List<PedidoTemp> temp = temps.findByNome(pedido.getNome());
		temps.deleteInBatch(temp);
		return "ok";
	}
	
	@RequestMapping(value = "/empresa", method = RequestMethod.PUT)
	@ResponseBody
	public Empresa editar() {
		return empresas.buscarId1();
	}
	
	@RequestMapping(value = "/excluirPedidosTemp/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public void excluirPedido(@ModelAttribute("id") Pedido pedido) {
		List<PedidoTemp> temp = temps.findByNome(pedido.getNome());
		temps.deleteInBatch(temp);
	}
	
	@RequestMapping("/imprimir")
	@ResponseBody
	public String imprimir(@RequestBody Pedido texto) throws PrintException, IOException {
		System.out.println("\n-------------- texto: " + texto.getPizzas());
		
		//salvar arquivo
		FileWriter fw = new FileWriter(new File("..\\impressaoTemp.txt"));

		BufferedWriter buffer = new BufferedWriter(fw);
		
		buffer.write(texto.getPizzas());

		buffer.close();
		
		//enviar para impressora
		String defaultPrinter = PrintServiceLookup.lookupDefaultPrintService().getName();
		System.out.println("Default printer: " + defaultPrinter);
		
		PrintService service = PrintServiceLookup.lookupDefaultPrintService();
		
		FileInputStream in = new FileInputStream(new File("..\\impressaoTemp.txt"));
		
		PrintRequestAttributeSet pras = new HashPrintRequestAttributeSet();
		pras.add(new Copies(1));
		
		DocFlavor flavor = DocFlavor.INPUT_STREAM.AUTOSENSE;
		Doc doc = new SimpleDoc(in, flavor, null);
		
		DocPrintJob job = service.createPrintJob();
		job.print(doc, pras);
		
		return "200";
	}
}
