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
@Table(name = "CUPONS")
public class Cupom extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private String nome;
	
	@Column(nullable=false)
	private String tipo;
	
	@Column(nullable=false)
	private String desconto;
	
	@Column(nullable=false)
	private String validade;
	
	@Column(nullable=false)
	private int codEmpresa;
}
