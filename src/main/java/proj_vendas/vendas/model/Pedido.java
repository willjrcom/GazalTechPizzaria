package proj_vendas.vendas.model;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

import org.springframework.stereotype.Service;

import lombok.Data;

@Data
@Entity
@Table(name = "PEDIDOS")
@Service
//@JsonIgnoreProperties(ignoreUnknown=true)
public class Pedido implements Serializable{
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private Long codigoPedido;
	private String nomePedido;
	private String celular;
	private String endereco;
	@Lob
	private String produtos;
	private String motoboy;
	private String ac;
	private TipoStatus status;
	private TipoEnvio envio;
	private String pagamento;

	private float total;
	private float troco;

	//@DateTimeFormat(pattern = "dd/MM/yyyy")
	private Date data;
	
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getCodigoPedido() {
		return codigoPedido;
	}
	public void setCodigoPedido(Long codigoPedido) {
		this.codigoPedido = codigoPedido;
	}
	public String getNomePedido() {
		return nomePedido;
	}
	public void setNomePedido(String nomePedido) {
		this.nomePedido = nomePedido;
	}
	public String getCelular() {
		return celular;
	}
	public void setCelular(String celular) {
		this.celular = celular;
	}
	public String getEndereco() {
		return endereco;
	}
	public void setEndereco(String endereco) {
		this.endereco = endereco;
	}
	public TipoStatus getStatus() {
		return status;
	}
	public void setStatus(TipoStatus status) {
		this.status = status;
	}
	public TipoEnvio getEnvio() {
		return envio;
	}
	public void setEnvio(TipoEnvio envio) {
		this.envio = envio;
	}
	public float getTotal() {
		return total;
	}
	public void setTotal(float total) {
		this.total = total;
	}
	public float getTroco() {
		return troco;
	}
	public void setTroco(float troco) {
		this.troco = troco;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	public String getProdutos() {
		return produtos;
	}
	public void setProdutos(String produtos) {
		this.produtos = produtos;
	}
	public String getMotoboy() {
		return motoboy;
	}
	public void setMotoboy(String motoboy) {
		this.motoboy = motoboy;
	}
	public String getAc() {
		return ac;
	}
	public void setAc(String ac) {
		this.ac = ac;
	}
	public String getPagamento() {
		return pagamento;
	}
	public void setPagamento(String pagamento) {
		this.pagamento = pagamento;
	}
	public Date getData() {
		return data;
	}
	public void setData(Date data) {
		this.data = data;
	}
	
}
