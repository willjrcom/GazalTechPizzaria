package proj_vendas.vendas.model.empresa;

import java.util.ArrayList;

import javax.persistence.Column;
import javax.persistence.Entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper = true)
@SuppressWarnings("serial")
@Entity
public class Comentario extends AbstractEntity<Long> {
	
	@Column(nullable = false)
	private String responsavel;
	
	@Column(nullable = false)
	private String descricao;
	
	@Column(nullable = false)
	private String data;

	@Column
	private ArrayList<String> curtida;

	@Column
	private ArrayList<String> descurtida;
}
