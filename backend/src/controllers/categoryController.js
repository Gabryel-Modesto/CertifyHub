import {
  selectCategoriesByUser,
  selectCategoryByIdAndUser,
  selectCategoryByName,
  insertCategory,
  updateCategoryByUser,
  deleteCategoryByUser,
} from "../model/categoryModel.js";

function isValidId(id) {
  return Number.isInteger(Number(id)) && Number(id) > 0;
}

async function getCategories(req, res) {
  try {
    const id_user = req.user.id;

    const categories = await selectCategoriesByUser(id_user);

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);

    return res.status(500).json({
      message: "Erro interno ao buscar categorias.",
    });
  }
}

async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const id_user = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "ID da categoria inválido.",
      });
    }

    const category = await selectCategoryByIdAndUser(Number(id), id_user);

    if (!category) {
      return res.status(404).json({
        message: "Categoria não encontrada.",
      });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);

    return res.status(500).json({
      message: "Erro interno ao buscar categoria.",
    });
  }
}

async function createCategory(req, res) {
  try {
    const id_user = req.user.id;
    const { name_category } = req.body;

    const normalizedName = name_category?.trim();

    if (!normalizedName) {
      return res.status(400).json({
        message: "O nome da categoria é obrigatório.",
      });
    }

    if (normalizedName.length > 100) {
      return res.status(400).json({
        message: "O nome da categoria deve possuir no máximo 100 caracteres.",
      });
    }

    const existingCategory = await selectCategoryByName(
      id_user,
      normalizedName,
    );

    if (existingCategory) {
      return res.status(409).json({
        message: "Você já possui uma categoria com esse nome.",
      });
    }

    const category = await insertCategory(id_user, normalizedName);

    return res.status(201).json({
      message: "Categoria cadastrada com sucesso.",
      category,
    });
  } catch (error) {
    console.error("Erro ao cadastrar categoria:", error);

    // Violação de constraint UNIQUE
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Você já possui uma categoria com esse nome.",
      });
    }

    return res.status(500).json({
      message: "Erro interno ao cadastrar categoria.",
    });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const id_user = req.user.id;
    const { name_category } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "ID da categoria inválido.",
      });
    }

    const normalizedName = name_category?.trim();

    if (!normalizedName) {
      return res.status(400).json({
        message: "O nome da categoria é obrigatório.",
      });
    }

    if (normalizedName.length > 100) {
      return res.status(400).json({
        message: "O nome da categoria deve possuir no máximo 100 caracteres.",
      });
    }

    const category = await selectCategoryByIdAndUser(Number(id), id_user);

    if (!category) {
      return res.status(404).json({
        message: "Categoria não encontrada.",
      });
    }

    const existingCategory = await selectCategoryByName(
      id_user,
      normalizedName,
    );

    if (existingCategory && existingCategory.id_category !== Number(id)) {
      return res.status(409).json({
        message: "Você já possui uma categoria com esse nome.",
      });
    }

    const updatedCategory = await updateCategoryByUser(
      Number(id),
      id_user,
      normalizedName,
    );

    return res.status(200).json({
      message: "Categoria atualizada com sucesso.",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Você já possui uma categoria com esse nome.",
      });
    }

    return res.status(500).json({
      message: "Erro interno ao atualizar categoria.",
    });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const id_user = req.user.id;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: "ID da categoria inválido.",
      });
    }

    const category = await selectCategoryByIdAndUser(Number(id), id_user);

    if (!category) {
      return res.status(404).json({
        message: "Categoria não encontrada.",
      });
    }

    const deletedCategory = await deleteCategoryByUser(Number(id), id_user);

    return res.status(200).json({
      message: "Categoria excluída com sucesso.",
      category: deletedCategory,
    });
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);

    // Categoria vinculada a certificados
    if (error.code === "23503") {
      return res.status(409).json({
        message:
          "Não é possível excluir esta categoria porque ela está vinculada a certificados.",
      });
    }

    return res.status(500).json({
      message: "Erro interno ao excluir categoria.",
    });
  }
}

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
