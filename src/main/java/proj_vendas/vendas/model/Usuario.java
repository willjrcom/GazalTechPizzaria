package proj_vendas.vendas.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "USUARIO",
		uniqueConstraints = {@UniqueConstraint(columnNames = {"email"})})
public class Usuario extends AbstractEntity<Long> {
	
	@Column(nullable=false)
	private int codEmpresa;
	
	@Column(nullable = false)
	private String nome;
	
	@Column(nullable=false)
	private String email;
	
	@Column(nullable=false)
	private String senha;
	
	@Column(nullable=false)
	private String perfil;

	@Column(nullable = false)
	private String dia;
	
	@Column(nullable = true)
	private String dataLimite;
	
	@Column(nullable = false)
	private boolean ativo;

	@OneToOne(cascade = CascadeType.ALL)
	private Empresa empresa;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Duvida> duvida;
}
