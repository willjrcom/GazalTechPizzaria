package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.springframework.stereotype.Service;

import proj_vendas.vendas.domain.AbstractEntity;

@SuppressWarnings("serial")
@Entity
@Table(name = "LOGMESA")
@Service
public class LogMesa extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private String mesa;
	
	@Column(nullable=false)
	private int codEmpresa;
	
	public String getMesa() {
		return mesa;
	}
	public void setMesa(String mesa) {
		this.mesa = mesa;
	}
	public int getCodEmpresa() {
		return codEmpresa;
	}
	public void setCodEmpresa(int codEmpresa) {
		this.codEmpresa = codEmpresa;
	}
	
	
}


