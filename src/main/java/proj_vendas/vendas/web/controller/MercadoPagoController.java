package proj_vendas.vendas.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.mercadopago.resources.datastructures.merchantorder.Item;

@Controller
@RequestMapping("/mercadoPago")
public class MercadoPagoController {
	
	@RequestMapping
	public ModelAndView tela() {
		return new ModelAndView("mercadoPago");
	}
	
	@RequestMapping(value = "/processar_pagamento", method = RequestMethod.POST)
	public String pagar() {
		// Configura credenciais
		//MercadoPago.SDK.setAccessToken("PROD_ACCESS_TOKEN");

		// Cria um objeto de preferência
		//Preference preference = new Preference();

		//Payer payer = new Payer();
		
		// Cria um item na preferência
		Item item = new Item();
		item.setId("01")
			.setTitle("1 mês de acesso")
			.setDescription("Desfrute do nosso site de vendas para seu negocio")
		    .setQuantity(1)
		    .setCurrencyId("BRL")
		    .setUnitPrice((float) 200.00);
		/*
		preference.setPayer(payer);
		preference.appendItem(item);
		preference.setMarketPlace(2.56);
		preference.setNotificationUrl("http://urlmarketplace.com/notification_ipn");
		preference.save();
		*/
		return "ok";
	}
}
