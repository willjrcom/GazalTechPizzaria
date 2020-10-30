package proj_vendas.vendas.web.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import proj_vendas.vendas.model.Dado;
import proj_vendas.vendas.model.Dia;
import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.model.PedidoTemp;
import proj_vendas.vendas.repository.Dados;
import proj_vendas.vendas.repository.Dias;
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
	
	@GetMapping("/fechamento")
	public ModelAndView tela() {
		return new ModelAndView("fechamento");
	}
	
	@RequestMapping(value = "/fechamento/Tpedidos", method = RequestMethod.PUT)
	@ResponseBody
	public long totalPedidos() {
		String dia = dias.buscarId1().getDia();
		return pedidos.findByStatusAndData("FINALIZADO", dia).size();
	}
	
	@RequestMapping(value = "/fechamento/Tvendas", method = RequestMethod.PUT)
	@ResponseBody
	public List<Pedido> totalVendas() {
		String dia = dias.buscarId1().getDia();
		return pedidos.findByStatusAndData("FINALIZADO", dia);
	}
	
	@RequestMapping(value = "/fechamento/baixartudo", method = RequestMethod.PUT)
	@ResponseBody
	public List<Pedido> baixarTudo() {
		return pedidos.findAll();
	}
	
	@RequestMapping(value = "/fechamento/buscarIdData/{data}", method = RequestMethod.PUT)
	@ResponseBody
	public Dado buscarId(@PathVariable String data) {
		return dados.findByData(data);
	}
	
	@RequestMapping(value = "/fechamento/finalizar/{id}", method = RequestMethod.PUT)
	@ResponseBody
	public Dado finalizarCaixa(@RequestBody Dado dado) {
		Dia data = dias.buscarId1(); //buscar tabela dia de acesso
		List<PedidoTemp> temp = temps.findByStatusAndData("PRONTO", data.getDia());
		temps.deleteInBatch(temp);
		return dados.save(dado);
	}
	
	@RequestMapping(value = "/fechamento/data", method = RequestMethod.PUT)
	@ResponseBody
	public Optional<Dia> data() {
		return dias.findById((long) 1);
	}
}
