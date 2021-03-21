package proj_vendas.vendas.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper = true)
@SuppressWarnings("serial")
@Entity
@Table(name = "DUVIDA", indexes = @Index(name = "concluido_index", columnList = "concluido"))
public class Duvida extends AbstractEntity<Long> {

	private String nome;
	private String duvida;
	private String data;
	private String validade;
	private String setor;
	private int codigo = 0;
	private boolean concluido;
	
	private ArrayList<String> curtida;
	private ArrayList<String> descurtida;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Comentario> comentario;
}
