package proj_vendas.vendas.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
public class Ingrediente extends AbstractEntity<Long> {

	private String nome;
	
	private float preco;
}
