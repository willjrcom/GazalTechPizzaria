package proj_vendas.vendas.model.empresa;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
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

	@Column(nullable = false)
	private String nome;
	
	@Column(nullable = false)
	private String duvida;
	
	@Column(nullable = false)
	private String data;
	
	@Column(nullable = false)
	private String validade;
	
	@Column(nullable = false)
	private String setor;

	@Column
	private int codigo = 0;

	@Column
	private boolean concluido = false;
	
	@Column(nullable = false)
	private ArrayList<String> curtida;
	
	@Column(nullable = false)
	private ArrayList<String> descurtida;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Comentario> comentario;
}
