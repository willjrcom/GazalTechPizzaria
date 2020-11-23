package proj_vendas.vendas.model;

import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;

import org.springframework.stereotype.Service;

import proj_vendas.vendas.domain.AbstractEntity;

@SuppressWarnings("serial")
@Entity
@Table(name = "DADOS")
@Service
public class Dado extends AbstractEntity<Long> {
	
	private String data;
	
	private double totalVendas = 0;
	private double totalLucro = 0;
	private int totalPizza = 0;
	private int totalProduto = 0;
	private double entregas = 0;
	private double balcao = 0;
	private double trocoInicio = 0;
	private double trocoFinal = 0;
	private int totalPedidos = 0;
	private int comanda = 0;
	
	@Lob
	private String compras;

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}

	public double getTotalVendas() {
		return totalVendas;
	}

	public void setTotalVendas(double totalVendas) {
		this.totalVendas = totalVendas;
	}

	public double getTotalLucro() {
		return totalLucro;
	}

	public void setTotalLucro(double totalLucro) {
		this.totalLucro = totalLucro;
	}

	public double getEntregas() {
		return entregas;
	}

	public void setEntregas(double entregas) {
		this.entregas = entregas;
	}

	public double getBalcao() {
		return balcao;
	}

	public void setBalcao(double balcao) {
		this.balcao = balcao;
	}

	public int getTotalPedidos() {
		return totalPedidos;
	}

	public void setTotalPedidos(int totalPedidos) {
		this.totalPedidos = totalPedidos;
	}

	public int getTotalPizza() {
		return totalPizza;
	}

	public void setTotalPizza(int totalPizza) {
		this.totalPizza = totalPizza;
	}

	public int getTotalProduto() {
		return totalProduto;
	}

	public void setTotalProduto(int totalProduto) {
		this.totalProduto = totalProduto;
	}

	public double getTrocoInicio() {
		return trocoInicio;
	}

	public void setTrocoInicio(double trocoInicio) {
		this.trocoInicio = trocoInicio;
	}

	public double getTrocoFinal() {
		return trocoFinal;
	}

	public void setTrocoFinal(double trocoFinal) {
		this.trocoFinal = trocoFinal;
	}

	public String getCompras() {
		return compras;
	}

	public void setCompras(String compras) {
		this.compras = compras;
	}

	public int getComanda() {
		return comanda;
	}

	public void setComanda(int comanda) {
		this.comanda = comanda;
	}
	
}


