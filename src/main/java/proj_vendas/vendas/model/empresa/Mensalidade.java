package proj_vendas.vendas.model.empresa;

import javax.persistence.Column;
import javax.persistence.Entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
public class Mensalidade extends AbstractEntity<Long>{

	@Column(nullable=false)
	private String log;

	@Column(nullable=false)
	private float valor;
	
	@Column(nullable=false)
	private String data;
}
