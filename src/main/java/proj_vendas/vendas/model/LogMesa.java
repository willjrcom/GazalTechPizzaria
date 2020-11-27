package proj_vendas.vendas.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.springframework.stereotype.Service;

import proj_vendas.vendas.domain.AbstractEntity;

@SuppressWarnings("serial")
@Entity
@Table(name = "LOGMESA")
@Service
public class LogMesa extends AbstractEntity<Long> {
	
	private String mesa;
	
	public String getMesa() {
		return mesa;
	}
	public void setMesa(String mesa) {
		this.mesa = mesa;
	}
	
	
}

