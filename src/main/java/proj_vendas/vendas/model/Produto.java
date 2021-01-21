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
@Table(name = "PRODUTOS")
public class Produto extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private String codigoBusca;
	
	@Column(nullable=false)
	private String nomeProduto;
	
	@Column(nullable=false)
	private float preco;
	private float custo;
	
	@Column(nullable=false)
	private String setor;
	private String descricao;
	
	@Column(nullable=false)
	private boolean disponivel;
	
	@Column(nullable=false)
	private int codEmpresa;
}
