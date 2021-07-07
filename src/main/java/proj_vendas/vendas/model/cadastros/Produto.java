package proj_vendas.vendas.model.cadastros;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "PRODUTO", indexes = { 
		@Index(name = "codEmpresa_index", columnList = "codEmpresa"),
		@Index(name = "codigoBusca_index", columnList = "codigoBusca"),
		@Index(name = "setor_index", columnList = "setor"),
		@Index(name = "descricao_index", columnList = "descricao"),
		@Index(name = "disponivel_index", columnList = "disponivel")
})
public class Produto extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private String codigoBusca;
	
	@Column(nullable=false)
	private String nome;

	@Column
	private float precoP;

	@Column
	private float custoP;

	@Column
	private float precoM;

	@Column
	private float custoM;

	@Column
	private float precoG;

	@Column
	private float custoG;
	
	@Column(nullable=false)
	private String setor;
	
	@Column(nullable = false)
	private String descricao;

	@Column
	private boolean disponivel = true;
	
	@Column(nullable=false)
	private Long codEmpresa;
}
