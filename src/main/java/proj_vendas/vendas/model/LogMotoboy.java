package proj_vendas.vendas.model;

import javax.persistence.Entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
public class LogMotoboy extends AbstractEntity<Long>{

	private int comanda;
	private float taxa;
	private String nome;
	private String endereco;
	private String motoboy;
}
