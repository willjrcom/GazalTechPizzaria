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
@Table(name = "ENDERECO")
public class Endereco extends AbstractEntity<Long>{
	
	private int cep;
	
	@Column(nullable=false)
	private String rua;
	
	@Column(nullable=false)
	private int n;
	
	@Column(nullable=false)
	private String bairro;
	
	@Column(nullable=false)
	private String cidade;
	private String referencia;
	
	private float taxa = 0;
}
