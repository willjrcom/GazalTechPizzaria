package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "DADOS")
public class Pagamento extends AbstractEntity<Long>{

	@Column(nullable=false)
	private int codEmpresa;

	@Column(nullable=false)
	private String log;

	@Column(nullable=false)
	private float mensalidade;
	
	@Column(nullable=false)
	private String data;
}
