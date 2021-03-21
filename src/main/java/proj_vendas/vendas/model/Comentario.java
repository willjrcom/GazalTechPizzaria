package proj_vendas.vendas.model;

import java.util.ArrayList;

import javax.persistence.Entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper = true)
@SuppressWarnings("serial")
@Entity
public class Comentario extends AbstractEntity<Long> {
	
	private String responsavel;
	private String descricao;
	private String data;
	
	private ArrayList<String> curtida;
	private ArrayList<String> descurtida;
}
