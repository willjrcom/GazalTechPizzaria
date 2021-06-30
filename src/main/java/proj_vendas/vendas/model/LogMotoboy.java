package proj_vendas.vendas.model;

import javax.persistence.Column;
import javax.persistence.Entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
public class LogMotoboy extends AbstractEntity<Long>{

	@Column(nullable = false)
	private int comanda;
	
	@Column(nullable = false)
	private float taxa;
	
	@Column(nullable = false)
	private String nome;
	
	@Column(nullable = false)
	private String endereco;
	
	@Column(nullable = false)
	private String motoboy;
}
