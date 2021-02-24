package proj_vendas.vendas.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "FICHASTECNICAS")
public class FichaTecnica extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private int codEmpresa;

	private String nome;
	
	private float preco;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Ingrediente> ingredientes;
}
