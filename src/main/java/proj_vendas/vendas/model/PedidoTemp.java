package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;

import org.springframework.stereotype.Service;

import proj_vendas.vendas.domain.AbstractEntity;

@SuppressWarnings("serial")
@Entity
@Table(name = "PEDIDOTEMPS")
@Service
public class PedidoTemp extends AbstractEntity<Long> {

	@Column(nullable=false)
	private Long comanda;
	
	@Column(nullable=false)
	private String nome;

	@Lob
	private String pizzas;
	
	@Column(nullable=false)
	private String status;
	
	@Column(nullable=false)
	private String envio;
	
	@Column(nullable=false)
	private String data;
	
	@Column(nullable=false)
	private int codEmpresa;

	public String getPizzas() {
		return pizzas;
	}
	public void setPizzas(String pizzas) {
		this.pizzas = pizzas;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	public Long getComanda() {
		return comanda;
	}
	public void setComanda(Long comanda) {
		this.comanda = comanda;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getEnvio() {
		return envio;
	}
	public void setEnvio(String envio) {
		this.envio = envio;
	}
	public int getCodEmpresa() {
		return codEmpresa;
	}
	public void setCodEmpresa(int codEmpresa) {
		this.codEmpresa = codEmpresa;
	}
}
