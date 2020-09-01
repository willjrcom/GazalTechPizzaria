package proj_vendas.vendas.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;

@Entity
@Table(name = "DIAATUAL")
@Service
public class DiaAtual implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	
	@DateTimeFormat(pattern = "dd/MM/yyyy")
	@Temporal(TemporalType.DATE)
	private Date dataHoje;
	
	private double totalVendas;
	private double totalLucro;
	private double entregas;
	private double balcao;
	private Long totalPedidos;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getDataHoje() {
		return dataHoje;
	}

	public void setDataHoje(Date dataHoje) {
		this.dataHoje = dataHoje;
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

	public Long getTotalPedidos() {
		return totalPedidos;
	}

	public void setTotalPedidos(Long totalPedidos) {
		this.totalPedidos = totalPedidos;
	}

	
}


