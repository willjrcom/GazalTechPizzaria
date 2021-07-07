package proj_vendas.vendas.model.log;

import javax.persistence.Column;
import javax.persistence.Entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
public class LogMesa extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private String mesa;
	
	@Column(nullable = false)
	private int contador = 0;
}


