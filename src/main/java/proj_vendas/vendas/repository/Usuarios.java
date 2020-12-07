package proj_vendas.vendas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Usuario;

@Transactional(readOnly = true)
public interface Usuarios extends JpaRepository<Usuario, Long>{
	
	@Query("select u from Usuario u where u.email like :email")
	public Usuario findByEmail(@Param("email") String email);

	//public List<Usuario> findByAtivo(boolean b);

	public List<Usuario> findByCodEmpresa(int codEmpresa);

	public List<Usuario> findByAtivo(boolean b);
}
