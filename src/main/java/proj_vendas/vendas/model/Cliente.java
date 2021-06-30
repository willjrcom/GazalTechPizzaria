package proj_vendas.vendas.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;

@Data
@EqualsAndHashCode(callSuper = true)
@SuppressWarnings("serial")
@Entity
@Table(name = "CLIENTE", indexes = { 
		@Index(name = "codEmpresa_index", columnList = "codEmpresa"),
		@Index(name = "nome_index", columnList = "nome"), 
		@Index(name = "cpf_index", columnList = "cpf"),
		@Index(name = "celular_index", columnList = "celular"),
		@Index(name = "contPedidos_index", columnList = "contPedidos"), 
})
public class Cliente extends AbstractEntity<Long> {

	@Column(nullable = false)
	private int codEmpresa;

	@Column(nullable = false)
	private String nome;
	
	@Column(nullable = false)
	private String senha;
	
	@Column(nullable = false)
	private String cpf;

	@Column(nullable = false)
	private Long celular;

	@OneToOne(cascade = CascadeType.ALL)
	private Endereco endereco;

	@Column(nullable = false)
	private String dataCadastro;
	
	@Column(nullable = false)
	private int contPedidos = 0;
}
