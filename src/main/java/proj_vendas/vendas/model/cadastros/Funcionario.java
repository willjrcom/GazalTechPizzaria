package proj_vendas.vendas.model.cadastros;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;
import lombok.EqualsAndHashCode;
import proj_vendas.vendas.domain.AbstractEntity;
import proj_vendas.vendas.model.empresa.Pagamento;

@Data
@EqualsAndHashCode(callSuper=true)
@SuppressWarnings("serial")
@Entity
@Table(name = "FUNCIONARIO", indexes = { 
		@Index(name = "codEmpresa_index", columnList = "codEmpresa"),
		@Index(name = "nome_index", columnList = "nome"), 
		@Index(name = "cpf_index", columnList = "cpf"),
		@Index(name = "celular_index", columnList = "celular"),
		@Index(name = "cargo_index", columnList = "cargo")
})
public class Funcionario extends AbstractEntity<Long>{
	
	@Column(nullable=false)
	private Long codEmpresa;
	
	@Column(nullable=false)
	private String nome;

	@Column(nullable=false)
	private String cpf;

	@Column(nullable = false)
	private String email;
	
	@Column(nullable=false)
	
	private String celular;
	
	@Column(nullable=false)
	private String cargo;
	
	@Column(nullable=false)
	private String sexo;
	
	@Column(nullable = false)
	private boolean situacao = true;

	@Column
	private int diaPagamento = 10;
	
	@Column(nullable = false)
	private BigDecimal salario;
	
	@Lob
	private String obs;
	
	@OneToOne(cascade = CascadeType.ALL)
	private Endereco endereco;

	@DateTimeFormat(pattern = "dd/MM/yyyy")
	@Temporal(TemporalType.DATE)
	private Date nascimento;
	
	@DateTimeFormat(pattern = "dd/MM/yyyy")
	@Temporal(TemporalType.DATE)
	private Date admissao;
	
	@OneToMany(cascade = CascadeType.ALL)
	private List<Pagamento> pagamento; 
}
