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
@Table(name = "PRODUTO")
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
