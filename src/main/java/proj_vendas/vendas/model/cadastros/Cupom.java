package proj_vendas.vendas.model.cadastros;

import javax.persistence.Column;
import javax.persistence.Entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
public class Cupom extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private String nome;

	@Column(nullable=false)
	private String descricao;
	
	@Column(nullable=false)
	private String desconto;
	
	@Column(nullable=false)
	private String validade;
}
