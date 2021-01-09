package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;

import proj_vendas.vendas.domain.AbstractEntity;

@SuppressWarnings("serial")
@Entity
@Table(name = "SALARIOS")
@Service
public class Salario extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private Long idFuncionario;
	
	@Column(nullable=false)
	private String usuario;
	
	@DateTimeFormat(pattern = "dd/MM/yyyy")
	private String data;
	
	@Column(nullable=false)
	private String logData;
	private int horas = 0;
	private double gastos = 0;
	private double pago = 0;
	
	@Column(nullable=false)
	private int codEmpresa;
	
	public Long getIdFuncionario() {
		return idFuncionario;
	}
	public void setIdFuncionario(Long idFuncionario) {
		this.idFuncionario = idFuncionario;
	}
	public int getHoras() {
		return horas;
	}
	public void setHoras(int horas) {
		this.horas = horas;
	}
	public double getGastos() {
		return gastos;
	}
	public void setGastos(double gastos) {
		this.gastos = gastos;
	}
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	public double getPago() {
		return pago;
	}
	public void setPago(double pago) {
		this.pago = pago;
	}
	public String getUsuario() {
		return usuario;
	}
	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}
	public String getLogData() {
		return logData;
	}
	public void setLogData(String logData) {
		this.logData = logData;
	}
	public int getCodEmpresa() {
		return codEmpresa;
	}
	public void setCodEmpresa(int codEmpresa) {
		this.codEmpresa = codEmpresa;
	}
	
	
}


