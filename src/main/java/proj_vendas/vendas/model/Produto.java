package proj_vendas.vendas.model;

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
	
	private float precoP;
	private float custoP;

	private float precoM;
	private float custoM;

	private float precoG;
	private float custoG;
	
	@Column(nullable=false)
	private String setor;
	private String descricao;
	
	private boolean disponivel;
	
	@Column(nullable=false)
	private int codEmpresa;
}
