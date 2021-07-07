package proj_vendas.vendas.model.cadastros;

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
	private Long codEmpresa;

	@Column(nullable = false)
	private String nome;

	@Column
	private String senha;

	@Column
	private String cpf;

	@Column(nullable = false)
	private Long celular;

	@OneToOne(cascade = CascadeType.ALL)
	private Endereco endereco;

	@Column
	private String dataCadastro;

	@Column
	private int contPedidos = 0;
}
