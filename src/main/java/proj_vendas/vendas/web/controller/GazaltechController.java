package proj_vendas.vendas.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import proj_vendas.vendas.model.Pedido;
import proj_vendas.vendas.repository.Pedidos;

@RestController
@RequestMapping("/gazaltech")
public class GazaltechController {

	@Autowired
	private Pedidos pedidos;
	
	@RequestMapping
	public List<Pedido> imprimir() {
		return pedidos.findAll();
	}
}
